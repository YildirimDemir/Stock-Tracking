import { getSession, signIn } from "next-auth/react";
import { signOut } from "next-auth/react";
import { notFound } from "next/navigation";

export async function userSignup(newUser: { username: string, email: string, password: string, passwordConfirm: string }) {
    try {
        const res = await fetch(`${process.env.LOCAL_HOST}/api/auth/register`, {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "Content-type": "application/json",
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to create a user");
        }

        return data;
    } catch (error) {
        // console.error(error.message);
        throw error;
    }
}

export async function userLogin(data: { email: string, password: string }) {
    const { email, password } = data;

    const result = await signIn("credentials", {
        redirect: false,
        email,
        password
    });

    if (result?.error) throw new Error("Email or password wrong...");
}

export async function userLogout() {
    await signOut();
}

export async function updateUserData(newData: { id: string, username: string, email: string }) {
    try {
        const { id, username, email } = newData;

        const res = await fetch(`${process.env.LOCAL_HOST}/api/users/${id}/userinfo`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to update a user");
        }

        await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password
        });

        return data;
    } catch (error) {
        // console.error(error.message);
        throw error;
    }
}


export async function updateUserPassword(newData: { id: string, passwordCurrent: string, newPassword: string, passwordConfirm: string }) {
    try {
        const { id, passwordCurrent, newPassword, passwordConfirm } = newData;

        const res = await fetch(`${process.env.LOCAL_HOST}/api/users/${id}/update-password`, {
            method: "PATCH",
            body: JSON.stringify({ passwordCurrent, newPassword, passwordConfirm }),
            headers: {
                "Content-type": "application/json",
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to update a user");
        }

        await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password
        });

        return data;
    } catch (error) {
        // console.error(error.message);
        throw error;
    }
}

export async function forgetResetPassword(data: { email: string }) {
    const { email } = data;

    try {
        const res = await fetch(`/api/auth/forget-password`, {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: {
                "Content-type": "application/json",
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to send an email");
        }

        return await res.json();
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in forgetResetPassword:', error.message);
            throw new Error(error.message);
        } else {
            console.error('Unexpected error:', error);
            throw new Error("An unexpected error occurred.");
        }
    }
}


export async function requestUser(email: string): Promise<any> {
    const session = await getSession();
    
    if (!session || !session.user) {
        // Oturum yoksa hata fırlat
        throw new Error("Unauthorized: No session found");
    }

    const res = await fetch(`${process.env.LOCAL_HOST}/api/auth/requestuser/${email}`);

    if (!res.ok) {
        throw new Error("Failed to fetch user by email");
    }

    const user = await res.json();

    if (!user) {
        notFound();
    }

    return user;
}

export const deleteUserAccount = async (userData: { userId: string, password: string, passwordConfirm: string }) => {
    if (userData.password !== userData.passwordConfirm) {
        throw new Error("Passwords do not match");
    }

    const response = await fetch('/api/auth/deleteaccount', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'user-id': userData.userId,
        },
        body: JSON.stringify({ password: userData.password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }

    // Kullanıcı hesabı silindikten sonra oturumu sonlandır
    await signOut({ redirect: false });

    return response.json();
};

export const resetPassword = async (data: { token: string, password: string, passwordConfirm: string }) => {
    if (data.password !== data.passwordConfirm) {
        throw new Error("Passwords do not match");
    }

    const response = await fetch('/api/auth/reset-password', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: data.token,
            password: data.password,
            passwordConfirm: data.passwordConfirm
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred while resetting the password');
    }

    return response.json();
};
