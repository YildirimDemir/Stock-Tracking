"use client";
import Style from "./register.module.css";
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { userSignup } from "@/services/apiUsers";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from "react";
import Link from "next/link";

interface RegisterFormInputs {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

const Register: React.FC = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState({
        password: false,
        passwordConfirm: false,
    });

    const mutation = useMutation({
        mutationFn: userSignup,
        onSuccess: () => {
            toast.success("User registered successfully");
            // 3 saniye sonra login sayfasına yönlendirir
            setTimeout(() => {
                router.replace("/login");
            }, 3000);
        },
        onError: (err: any) => toast.error(err.message),
    });

    const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm<RegisterFormInputs>();

    const submitRegister: SubmitHandler<RegisterFormInputs> = (data) => {
        mutation.mutate(data);
    };

    const isLoading = mutation.status === 'pending';

    const togglePasswordVisibility = (field: keyof typeof showPassword) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className={Style.registerArea}>
            <div className={Style.registerFormArea}>
                <h2>REGISTER</h2>
                <form className={Style.registerForm} onSubmit={handleSubmit(submitRegister)}>
                    <div className={Style.formInputGroup}>
                        <label htmlFor="username">Username:</label>
                        <input 
                            disabled={isLoading} 
                            type="text" 
                            id="username" 
                            placeholder="your username"
                            {...register("username", { required: "This field is required." })}
                        />
                        <p className={Style.errorText}>{errors?.username?.message}</p>
                    </div>
                    <div className={Style.formInputGroup}>
                        <label htmlFor="email">Email:</label>
                        <input 
                            disabled={isLoading} 
                            type="email" 
                            id="email" 
                            placeholder="you@example.com"
                            {...register("email", { required: "This field is required." })}
                        />
                        <p className={Style.errorText}>{errors?.email?.message}</p>
                    </div>
                    <div className={Style.formInputGroup}>
                        <label htmlFor="password">Password:</label>
                        <div className={Style.passInput}>
                            <input 
                                disabled={isLoading} 
                                type={showPassword.password ? "text" : "password"} 
                                id="password" 
                                placeholder="********"
                                className={Style.inputTypePass}
                                {...register("password", {
                                    required: "This field is required.",
                                    minLength: {
                                        value: 8,
                                        message: "Password should be at least 8 characters long"
                                    }
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('password')}
                                className={Style.toggleButton}
                            >
                                {showPassword.password ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                        <p className={Style.errorText}>{errors?.password?.message}</p>
                    </div>
                    <div className={Style.formInputGroup}>
                        <label htmlFor="password-confirm">Confirm Password:</label>
                        <div className={Style.passInput}>
                            <input 
                                disabled={isLoading} 
                                className={Style.inputTypePass}
                                type={showPassword.passwordConfirm ? "text" : "password"} 
                                id="password-confirm" 
                                placeholder="********"
                                {...register("passwordConfirm", {
                                    required: "This field is required.",
                                    validate: value => value === getValues().password || "Passwords must match"
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('passwordConfirm')}
                                className={Style.toggleButton}
                            >
                                {showPassword.passwordConfirm ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                        <p className={Style.errorText}>{errors?.passwordConfirm?.message}</p>
                    </div>
                    <button className={Style.btn} disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                    <Link href="/login" className={Style.formLink}>
                        Have an Account?
                    </Link>
                </form>
            </div>
        </div>
    )
};

export default Register;
