"use client";
import { resetPassword } from '@/services/apiUsers';
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Style from './resetpassword.module.css';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface ResetPasswordProps {
  token: string;
}

export default function ResetPassword({ token }: ResetPasswordProps) {
  const [showPassword, setShowPassword] = useState({
    password: false,
    passwordConfirm: false,
  });
  const router = useRouter();
  const { mutate, status } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully");
      reset();
      router.push('/login');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const isLoading = status === 'pending';

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    token: string;
    password: string;
    passwordConfirm: string;
  }>({
    defaultValues: { token } 
  });

  const submitResetPassword: SubmitHandler<{
    token: string;
    password: string;
    passwordConfirm: string;
  }> = (data) => {
    mutate({
      token: data.token,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className={Style.resetPassword}>
      <div className={Style.resetPasswordFormArea}>
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit(submitResetPassword)}>
          <div>
            <label htmlFor="token">Token:</label>
            <input
              type="text"
              id="token"
              placeholder="Enter your reset token"
              {...register("token", { required: "Token is required." })}
            />
            <p>{errors.token?.message}</p>
          </div>
          <div className={Style.formInputGroup}>
            <label htmlFor="password">New Password:</label>
            <div className={Style.passInput}>
              <input
                type={showPassword.password ? "text" : "password"} 
                id="password"
                placeholder="Enter your new password"
                {...register("password", { required: "This field is required." })}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className={Style.toggleButton}
              >
                {showPassword.password ? <FaEye /> : <FaEyeSlash />}
              </button>
              <p>{errors.password?.message}</p>
            </div>
          </div>
          <div className={Style.formInputGroup}>
            <label htmlFor="passwordConfirm">Confirm Password:</label>
            <div className={Style.passInput}>
              <input
                type={showPassword.passwordConfirm ? "text" : "password"} 
                id="passwordConfirm"
                placeholder="Confirm your new password"
                {...register("passwordConfirm", { required: "This field is required." })}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('passwordConfirm')}
                className={Style.toggleButton}
              >
                {showPassword.passwordConfirm ? <FaEye /> : <FaEyeSlash />}
              </button>
              <p>{errors.passwordConfirm?.message}</p>
            </div>
          </div>
          <div className={Style.btn}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
