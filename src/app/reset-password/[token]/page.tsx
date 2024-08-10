import ResetPassword from '@/components/Auth/ResetPassword';
import React from 'react'

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default function page({ params }: ResetPasswordPageProps) {
  return <ResetPassword token={params.token} />;
}
