import { FormProvider } from '../context/FormContext';
import MainLayout from '../components/MainLayout';

export default function FarmFormPage() {
  return (
    <FormProvider>
      <MainLayout />
    </FormProvider>
  );
}
