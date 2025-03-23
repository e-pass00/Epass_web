import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  onAuthStateChanged,
  sendPasswordResetEmail, // Ajout de cette fonction
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';

// Fonction simplifiée pour les messages d'erreur orientés utilisateur
const getAuthErrorMessage = (error) => {
  switch (error.code) {
    // Erreurs de connexion
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email ou mot de passe incorrect';

    // Erreurs de création de compte
    case 'auth/email-already-in-use':
      return 'Un compte existe déjà avec cet email';

    case 'auth/weak-password':
      return 'Le mot de passe doit contenir au moins 6 caractères';

    case 'auth/invalid-email':
      return "L'adresse email n'est pas valide";

    // Erreurs d'accès
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé';

    // Erreurs de sécurité
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez réessayer dans quelques minutes';

    // Erreurs de connexion Google
    case 'auth/popup-closed-by-user':
      return 'La connexion a été annulée';

    case 'auth/popup-blocked':
      return 'Veuillez autoriser les popups pour vous connecter avec Google';

    // Erreurs de connexion réseau
    case 'auth/network-request-failed':
      return 'Problème de connexion internet';

    // Erreur par défaut
    default:
      return `Une erreur est survenue (${error.code}). Veuillez réessayer`;
  }
};

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isModalOpen: false,
  redirectAfterLogin: null,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            set({
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                emailVerified: firebaseUser.emailVerified,
                username: userData.username,
                role: userData.role,
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
              },
              loading: false,
            });
          } else {
            set({
              user: null,
              loading: false,
              error: 'Impossible de récupérer vos informations',
            });
          }
        } catch (error) {
          set({
            loading: false,
            error: 'Impossible de récupérer vos informations',
          });
        }
      } else {
        set({ user: null, loading: false });
      }
    });

    return unsubscribe;
  },

  setError: (error) => set({ error: getAuthErrorMessage(error) }),

  openModal: (redirectUrl) =>
    set({
      isModalOpen: true,
      redirectAfterLogin: redirectUrl || null,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      error: null,
      redirectAfterLogin: null,
    }),

  signUp: async (email, password, username) => {
    try {
      if (!email || !password || !username) {
        throw new Error('Veuillez remplir tous les champs');
      }

      if (username.length < 3) {
        throw new Error("Le nom d'utilisateur est trop court");
      }

      set({ loading: true, error: null });

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user: firebaseUser } = userCredential;

      await sendEmailVerification(firebaseUser, {
        url: 'https://eppass.netlify.app',
      });

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        username,
        email,
        role: 'utilisateur',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      set({
        loading: false,
        isModalOpen: false,
      });

      return firebaseUser;
    } catch (error) {
      const errorMessage = error.code
        ? getAuthErrorMessage(error)
        : error.message;
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  signIn: async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Veuillez remplir tous les champs');
      }

      set({ loading: true, error: null });
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      set({
        loading: false,
        isModalOpen: false,
      });

      const { redirectAfterLogin } = get();
      if (redirectAfterLogin) {
        window.location.href = redirectAfterLogin;
      }

      return firebaseUser;
    } catch (error) {
      const errorMessage = error.code
        ? getAuthErrorMessage(error)
        : error.message;
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const provider = new GoogleAuthProvider();

      // Configure Google Sign-In pour afficher le sélecteur de compte
      provider.setCustomParameters({
        prompt: 'select_account', // Force l'affichage du sélecteur de compte
      });

      const { user: firebaseUser } = await signInWithPopup(auth, provider);

      // Créer ou mettre à jour le document utilisateur
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: firebaseUser.uid,
          username: firebaseUser.displayName || 'Utilisateur',
          email: firebaseUser.email,
          role: 'utilisateur',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      set({
        loading: false,
        isModalOpen: false,
      });

      const { redirectAfterLogin } = get();
      if (redirectAfterLogin) {
        window.location.href = redirectAfterLogin;
      }

      return firebaseUser;
    } catch (error) {
      const errorMessage = error.code
        ? getAuthErrorMessage(error)
        : error.message;
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Nouvelle fonction pour la réinitialisation du mot de passe
  resetPassword: async (email) => {
    try {
      if (!email) {
        throw new Error('Veuillez indiquer votre adresse email');
      }

      set({ loading: true, error: null });

      // Envoi de l'email de réinitialisation
      await sendPasswordResetEmail(auth, email, {
        url: 'https://eppass.netlify.app/login', // URL de redirection après réinitialisation
      });

      set({ loading: false });

      return true;
    } catch (error) {
      const errorMessage = error.code
        ? getAuthErrorMessage(error)
        : error.message;
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await signOut(auth);
      set({
        user: null,
        loading: false,
      });
    } catch (error) {
      set({
        error: 'Erreur lors de la déconnexion',
        loading: false,
      });
      throw new Error('Erreur lors de la déconnexion');
    }
  },

  isAuthenticated: () => {
    const { user } = get();
    return !!user;
  },
}));

export default useAuthStore;
