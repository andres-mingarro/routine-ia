import { Metadata } from 'next';
import SetupForm from '@/components/SetupForm';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import styles from './setup.module.scss';

export const metadata: Metadata = {
  title: 'Tu Perfil - Routine IA',
};

export default function SetupPage() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <Header
          title="Tu Perfil"
          subtitle="Configurá tus datos para rutinas personalizadas"
        />
        <SetupForm />
      </main>
      <Navigation />
    </div>
  );
}
