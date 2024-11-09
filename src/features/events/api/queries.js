import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFavoritesStore } from '../stores/favoritesStores';
import useAuthStore from '../../auth/stores/authStore';
import { auth } from '../../../config/firebase';

const API_URL = 'https://api-fijfw4ptuq-uc.a.run.app';

// Fonction utilitaire modifiée pour obtenir le token Firebase
const getFirebaseToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Utilisateur non authentifié');
  }
  return await currentUser.getIdToken();
};

// Ajout de la nouvelle clé dans eventKeys
// Ajout de la nouvelle clé dans eventKeys
export const eventKeys = {
  all: ['events'],
  upcoming: () => [...eventKeys.all, 'upcoming'],
  detail: (id) => [...eventKeys.all, 'detail', id],
  favorites: () => [...eventKeys.all, 'favorites'],
  userTickets: () => [...eventKeys.all, 'userTickets'],
  ticketCategories: (eventId) => [
    ...eventKeys.all,
    'ticketCategories',
    eventId,
  ],
  userNotifications: () => [...eventKeys.all, 'userNotifications'],
  transferTicket: (ticketId) => [...eventKeys.all, 'transfer', ticketId],
};

// Modified transferTicket function with proper error handling and validation
const transferTicket = async ({ billetId, recipientName }) => {
  try {
    // Input validation
    if (!billetId || !recipientName) {
      throw {
        status: 400,
        message: 'Informations manquantes pour le transfert',
        error: 'MISSING_PARAMETERS',
        details: {
          billetId: !billetId ? 'Billet ID requis' : null,
          recipientName: !recipientName ? 'Nom du destinataire requis' : null,
        },
      };
    }

    const token = await getFirebaseToken();

    if (!token) {
      throw new Error("Token d'authentification non disponible");
    }

    const response = await fetch(`${API_URL}/billets/transferBillet`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        billetId: billetId.toString(), // Ensure billetId is a string
        recipientName: recipientName.trim(), // Remove any leading/trailing whitespace
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = {
        status: response.status,
        message: data.message || 'Une erreur est survenue',
        error: data.error || 'UNKNOWN_ERROR',
        details: data.details,
      };

      // Gestion spécifique des codes d'erreur
      switch (response.status) {
        case 400:
          if (data.error === 'SELF_TRANSFER') {
            errorMessage.message =
              'Vous ne pouvez pas transférer le billet à vous-même';
          } else if (data.error === 'MISSING_PARAMETERS') {
            errorMessage.message = 'Informations manquantes pour le transfert';
          }
          break;
        case 401:
          errorMessage.message = 'Non autorisé - Veuillez vous reconnecter';
          errorMessage.error = 'UNAUTHORIZED';
          break;
        case 403:
          if (data.error === 'UNAUTHORIZED_ACTION') {
            errorMessage.message =
              'Vous ne pouvez transférer que votre propre billet';
          } else if (data.error === 'TICKET_ALREADY_SCANNED') {
            errorMessage.message =
              'Impossible de transférer un billet déjà scanné';
          } else if (data.error === 'TRANSFER_LIMIT_EXCEEDED') {
            errorMessage.message =
              'Limite de transfert atteinte pour ce billet';
          }
          break;
        case 404:
          if (data.error === 'BILLET_NOT_FOUND') {
            errorMessage.message = 'Billet non trouvé';
          } else if (data.error === 'RECIPIENT_NOT_FOUND') {
            errorMessage.message = "Le destinataire n'a pas été trouvé";
          }
          break;
        case 500:
          errorMessage.message =
            'Erreur serveur - Veuillez réessayer plus tard';
          errorMessage.error = 'SERVER_ERROR';
          break;
      }

      console.error('Erreur lors du transfert:', errorMessage);
      throw errorMessage;
    }

    return data;
  } catch (error) {
    // Gestion des erreurs réseau
    if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
      throw {
        status: 0,
        message:
          'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        error: 'NETWORK_ERROR',
      };
    }

    // Gestion des erreurs d'authentification
    if (error.message === "Token d'authentification non disponible") {
      throw {
        status: 401,
        message: error.message,
        error: 'AUTH_ERROR',
      };
    }

    throw error;
  }
};

// Modified React Query mutation hook with proper error handling
export const useTransferTicket = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: transferTicket,
    onMutate: async ({ billetId, recipientName }) => {
      // Vérification de l'authentification
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Validate inputs before mutation
      if (!billetId || !recipientName.trim()) {
        throw new Error('Informations manquantes pour le transfert');
      }

      // Annulation des requêtes en cours pour ce billet
      await queryClient.cancelQueries(eventKeys.userTickets());

      // Snapshot des données précédentes
      const previousTickets = queryClient.getQueryData(eventKeys.userTickets());

      return { previousTickets };
    },
    onError: (error, variables, context) => {
      // En cas d'erreur, on restaure les données précédentes
      if (context?.previousTickets) {
        queryClient.setQueryData(
          eventKeys.userTickets(),
          context.previousTickets
        );
      }
      console.error('Erreur lors du transfert du billet:', error);
    },
    onSuccess: () => {
      // Invalidation des queries pour forcer le rafraîchissement des données
      queryClient.invalidateQueries(eventKeys.userTickets());
      queryClient.invalidateQueries(eventKeys.userNotifications());
    },
  });
};

const fetchUserNotifications = async () => {
  try {
    const token = await getFirebaseToken();

    if (!token) {
      throw new Error("Token d'authentification non disponible");
    }

    const response = await fetch(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    // Cas spécifique : status 404 = aucune notification
    if (response.status === 404) {
      return [];
    }

    // Gestion des autres erreurs
    if (!response.ok) {
      const errorMessage = {
        status: response.status,
        message: data.message || 'Une erreur est survenue',
        error: data.error || 'UNKNOWN_ERROR',
        details: data.details,
      };

      // Gestion spécifique des codes d'erreur
      switch (response.status) {
        case 400:
          errorMessage.message = data.message || "L'uid est manquant";
          errorMessage.error = 'MISSING_UID';
          break;
        case 401:
          errorMessage.message = 'Non autorisé - Veuillez vous reconnecter';
          errorMessage.error = 'UNAUTHORIZED';
          break;
        case 500:
          errorMessage.message =
            'Erreur serveur - Veuillez réessayer plus tard';
          errorMessage.error = 'SERVER_ERROR';
          break;
      }

      console.error('Erreur serveur:', errorMessage);
      throw errorMessage;
    }

    // Vérification du succès de la réponse
    if (!data.success) {
      throw new Error(
        data.message || 'Erreur lors de la récupération des notifications'
      );
    }

    // Si tout est OK, on retourne les données
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    // Gestion des erreurs réseau
    if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
      throw {
        status: 0,
        message:
          'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        error: 'NETWORK_ERROR',
      };
    }

    // Gestion des erreurs d'authentification
    if (error.message === "Token d'authentification non disponible") {
      throw {
        status: 401,
        message: error.message,
        error: 'AUTH_ERROR',
      };
    }

    throw error;
  }
};

export const useUserNotifications = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: eventKeys.userNotifications(),
    queryFn: fetchUserNotifications,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
};

const fetchEventTicketCategories = async (eventId) => {
  try {
    if (!eventId) {
      throw new Error("L'ID de l'événement est requis");
    }

    const response = await fetch(
      `${API_URL}/eventsBillets/categoriesBillets/${eventId}`
    );
    const data = await response.json();

    // Vérification si la réponse n'est pas ok (status >= 400)
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error(data.message || "L'ID de l'événement est manquant");
        case 404:
          throw new Error(data.message || 'Aucune catégorie de billet trouvée');
        case 500:
          throw new Error(data.message || 'Erreur serveur');
        default:
          throw new Error(data.message || 'Une erreur est survenue');
      }
    }

    // Vérification de la structure de la réponse
    if (!data.success) {
      throw new Error(
        data.message ||
          'Erreur lors de la récupération des catégories de billets'
      );
    }

    // Vérification si data.data existe et est un tableau
    if (!Array.isArray(data.data)) {
      throw new Error('Format de données invalide');
    }
    console.log(data.data);
    return data.data;
  } catch (error) {
    // Gestion des erreurs réseau
    if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
      throw new Error(
        'Erreur de connexion - Vérifiez votre connexion internet'
      );
    }

    // Propagation de l'erreur
    console.error(
      'Erreur lors de la récupération des catégories de billets:',
      error
    );
    throw error;
  }
};

export const useEventTicketCategories = (eventId) => {
  return useQuery({
    queryKey: eventKeys.ticketCategories(eventId),
    queryFn: () => fetchEventTicketCategories(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // Cache valide pendant 5 minutes
    select: (data) => {
      // Vous pouvez ajouter ici une transformation des données si nécessaire
      return data.map((category) => ({
        ...category,
        price: parseFloat(category.price), // Assure que le prix est un nombre
      }));
    },
  });
};
const fetchUserTickets = async () => {
  try {
    const token = await getFirebaseToken();

    if (!token) {
      throw new Error("Token d'authentification non disponible");
    }

    const response = await fetch(`${API_URL}/billets/billetsByUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // Si la réponse n'est pas ok, on lance une erreur avec le message du serveur
    if (!response.ok) {
      const errorMessage = {
        status: response.status,
        message: data.message || 'Une erreur est survenue',
        error: data.error || 'UNKNOWN_ERROR',
        details: data.details,
      };

      // Log de l'erreur pour le débogage
      console.error('Erreur serveur:', errorMessage);

      // On lance une nouvelle erreur avec les détails
      throw {
        ...errorMessage,
        isServerError: true, // Flag pour identifier les erreurs serveur
      };
    }

    // Vérification supplémentaire de la structure de la réponse
    if (!data.success || !data.data) {
      throw new Error('Format de réponse invalide');
    }

    console.log(data.data);
    return data.data;
  } catch (error) {
    // Gestion spécifique des erreurs réseau
    if (!error.isServerError) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw {
          status: 0,
          message:
            'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
          error: 'NETWORK_ERROR',
        };
      }

      // Erreur lors de la récupération du token
      if (error.message === "Token d'authentification non disponible") {
        throw {
          status: 401,
          message: error.message,
          error: 'AUTH_ERROR',
        };
      }
    }

    // On propage l'erreur avec sa structure complète
    throw error;
  }
};

export const useUserTickets = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: eventKeys.userTickets(),
    queryFn: fetchUserTickets,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      if (!data) return { upcoming: [], history: [] };

      return {
        upcoming: data.filter((ticket) => ticket.status === 'available'),
        history: data.filter((ticket) => ticket.status === 'scanned'),
      };
    },
  });
};

export const fetchFavoriteEvents = async () => {
  try {
    const token = await getFirebaseToken();
    const response = await fetch(
      `${API_URL}/eventsBillets/eventsBilletsFavoris`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    // Vérifier si la réponse n'est pas ok (status >= 400)
    if (!response.ok) {
      // Gérer les différents codes d'erreur HTTP
      switch (response.status) {
        case 400:
          throw new Error(data.message || 'Requête invalide');
        case 401:
          throw new Error('Non autorisé - Veuillez vous reconnecter');
        case 403:
          throw new Error('Accès refusé');
        case 404:
          return []; // Retourner un tableau vide si aucun favori n'est trouvé
        case 500:
          throw new Error('Erreur serveur - Veuillez réessayer plus tard');
        default:
          throw new Error(data.message || 'Une erreur est survenue');
      }
    }

    // Vérifier la structure de la réponse
    if (!data.success) {
      throw new Error(
        data.message || 'Erreur lors de la récupération des favoris'
      );
    }

    // Vérifier si data.data existe et est un tableau
    if (!Array.isArray(data.data)) {
      throw new Error('Format de données invalide');
    }

    return data.data;
  } catch (error) {
    // Gérer les erreurs de réseau
    if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
      throw new Error(
        'Erreur de connexion - Veuillez vérifier votre connexion internet'
      );
    }

    // Gérer les erreurs de token
    if (error.message.includes('token')) {
      throw new Error("Erreur d'authentification - Veuillez vous reconnecter");
    }

    // Propager l'erreur avec un message plus descriptif
    console.error('Erreur lors de la récupération des favoris:', error);
    throw new Error(error.message || 'Une erreur inattendue est survenue');
  }
};

export const useFavoriteEvents = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: eventKeys.favorites(),
    queryFn: fetchFavoriteEvents,
    enabled: !!user, // La requête ne s'exécute que si l'utilisateur est connecté
    staleTime: 5 * 60 * 1000,
  });
};

export const toggleEventFavorite = async (eventId) => {
  try {
    // Obtention du token Firebase
    const token = await getFirebaseToken();

    const response = await fetch(`${API_URL}/events/Favorites/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 'Erreur lors de la mise à jour des favoris'
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors du toggle favorite:', error);
    throw error;
  }
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { addFavorite, removeFavorite } = useFavoritesStore();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: toggleEventFavorite,
    onMutate: async (eventId) => {
      // Vérification de l'authentification
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }
    },
    onSuccess: (data, eventId) => {
      queryClient.invalidateQueries(eventKeys.detail(eventId));

      if (data.success) {
        if (data.message.includes('ajouté')) {
          addFavorite(eventId);
        } else {
          removeFavorite(eventId);
        }
      }
    },
    onError: (error) => {
      console.error('Erreur lors du toggle favorite:', error);
    },
  });
};

// Les autres fonctions restent inchangées
export const fetchEvents = async () => {
  const response = await fetch(`${API_URL}/eventsBillets`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des événements');
  }
  return await response.json();
};

const fetchEventById = async (id) => {
  if (!id) {
    throw new Error('ID manquant pour la requête');
  }

  const response = await fetch(`${API_URL}/eventsBillets/${id}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.data;
};

export const useEvent = (eventId) => {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => fetchEventById(eventId),
    staleTime: 5 * 60 * 1000,
    enabled: !!eventId,
  });
};

export const useEvents = () => {
  return useQuery({
    queryKey: eventKeys.upcoming(),
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
  });
};
