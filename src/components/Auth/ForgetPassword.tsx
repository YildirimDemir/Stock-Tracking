"use client";
import { forgetResetPassword } from '@/services/apiUsers';
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Style from './forgetpassword.module.css';

interface ForgetPasswordFormInputs {
  email: string;
}

export default function ForgetPassword() {
  const { mutate, status } = useMutation({
    mutationFn: forgetResetPassword,
    onSuccess: () => {
      toast.success("Email was sent successfully");
      reset();
    },
    onError: (err: any) => toast.error(err.message)
  });

  const isLoading = status === 'pending';

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ForgetPasswordFormInputs>();

  const submitSendEmail: SubmitHandler<ForgetPasswordFormInputs> = (data) => {
    mutate(data);
  };

  return (
    <div className={Style.forgetPassword}>
      <div className={Style.forgetPasswordFormArea}>
        <h2>Enter Your Email</h2>
        <form onSubmit={handleSubmit(submitSendEmail)}>
          <div className={Style.formInputGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              {...register("email", { required: "This field is required." })}
            />
            <p>{errors.email?.message}</p>
          </div>

          <div className={Style.btn}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
