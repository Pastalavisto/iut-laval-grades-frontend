import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useAuth } from '@/hooks/AuthProvider';
import { useNavigate } from 'react-router';

const formSchema = z.object({
  email: z.string().email({
    message: 'Entrez une adresse email valide.'
  }),
  password: z.string().min(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.'
  })
});

export function LoginForm() {
  const navigate = useNavigate();
  const auth = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    auth
      ?.login(values)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
        if (error.response?.status === 401) {
          form.setError('password', {
            type: 'manual',
            message: 'Email ou mot de passe incorrect.'
          });
        }
      });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-800 text-center">
            IUT de Laval
            <br />-<br />
            Gestion des notes
          </h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-primary-blue text-white py-2 px-4 rounded-md hover:bg-primary-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            S'identifier
          </Button>
        </form>
      </Form>
    </div>
  );
}
