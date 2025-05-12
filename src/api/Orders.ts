import {Order, Responses, TutorProfile} from "@/models/Order.ts";

const api_link: string = 'https://lessonsmy.tech/api';

interface JWTPayload {
    exp?: number;
    [key: string]: any; // Allow other fields
}

function isTokenExpired(token: string): boolean {
    try {
        // Split the token into parts
        const [, payload] = token.split('.');

        // Decode base64 payload (works in both browser and Node.js)
        const decodedPayload = JSON.parse(
            typeof atob === 'function'
                ? atob(payload) // Browser environment
                : Buffer.from(payload, 'base64').toString('utf8') // Node.js environment
        ) as JWTPayload;

        // Check if exp exists and compare with current time (in seconds)
        if (decodedPayload.exp) {
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            return decodedPayload.exp < currentTime;
        }

        // If no exp claim, assume not expired
        return false;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true; // Treat invalid tokens as expired for safety
    }
}

export const getToken = async (userdata: string): Promise<string | null> => {
    try {
        if (!userdata) {
            return null // navigate auth page
        }
        const ResponseData = await fetch(`https://lessonsmy.tech/auth/init-data`, {
            method: "POST",
            body: JSON.stringify({
                "initData": userdata,
                "role": "Tutor",
            }),
            headers: {"Content-Type": 'application/json'},
        });

        console.log("Response status:", ResponseData.status);
        console.log("Response headers:", ResponseData.headers);

        if (!ResponseData.ok) {
            const errorText = await ResponseData.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }
        const result = await ResponseData.json();
        return result.token;
    } catch (error) {
        console.error(error);
        return null
    }
}


export const sendData = async (userdata: string): Promise<string | null> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return null // navigate auth page
        }
        const ResponseData = await fetch(`${api_link}/users`, {
            method: "POST",
            headers: {"Authorization": AuthToken },
        });

        console.log("Response status:", ResponseData.status);
        console.log("Response headers:", ResponseData.headers);

        if (!ResponseData.ok) {
            const errorText = await ResponseData.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }
        const result = await ResponseData.json();
        return result.text;
    } catch (error) {
        console.error(error);
        return null
    }
}

export const getOrders = async (): Promise<Order[] | null> => {
    try {
        const ResponseOrders = await fetch("https://lessonsmy.tech/api/admins/orders", {
            method: "GET",
            headers: {"Authorization": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMmU3N2IxZWEtODA3Zi00M2M1LWEwNjUtOTJhYTQ1N2Q0MDExIiwidXNlcm5hbWUiOiJRcGlzayIsInRlbGVncmFtX2lkIjo1MDY2NDU1NDIsInJvbGUiOiJBZG1pbiIsImV4cCI6MTc0NzExMDMyN30.9_uIPlkCfLLl35KMzZ4ZXV3_gpcB1CEp80_qs8KEQqY'}
            });

        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            const errorText = await ResponseOrders.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }
        const data = await ResponseOrders.json();
        console.warn(data)

        return data;
    } catch (error) {
        console.error(error);
        return null
    }
}

export const Activate = async (id: string): Promise<boolean> => {
    try {
        const ResponseOrders = await fetch(`https://lessonsmy.tech/api/admins/approve/order/id/${id}`, {
            method: "POST",
            body: JSON.stringify({
                "initData": "user=%7B%22id%22%3A506645542%2C%22first_name%22%3A%22%D0%9A%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Qpisk%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fvcyf1GN_IZljdIiW8Z7XVz4O5yGsPLA4UCi9CKk3q5c.svg%22%7D&chat_instance=9021293784835571208&chat_type=private&auth_date=1735911385&signature=2u3G0CLvUQxLlBRs70Ps-yFusrmKhgv4m6gMA5dVwvuHMgzJXp8Um22IevLQ6Y-CmKB22gUZkWsFqe-FbTdyDg&hash=97eb5ad6b6e180bc2a7dc27d382ca606cc9b066ec6ae621228b257821fe9e4bc",
                "role": "Admin",
            }),
            headers: {"Authorization": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMmU3N2IxZWEtODA3Zi00M2M1LWEwNjUtOTJhYTQ1N2Q0MDExIiwidXNlcm5hbWUiOiJRcGlzayIsInRlbGVncmFtX2lkIjo1MDY2NDU1NDIsInJvbGUiOiJBZG1pbiIsImV4cCI6MTc0NzExMDMyN30.9_uIPlkCfLLl35KMzZ4ZXV3_gpcB1CEp80_qs8KEQqY',
                'Content-Type': 'application/json'},
        });

        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            const errorText = await ResponseOrders.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }

        return ResponseOrders.ok;
    } catch (err) {
        return false;
    }
}

export const responseOrder = async (id: string, userdata: string, responseText: string): Promise<string | null> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return null // navigate auth page
        }
        if (isTokenExpired(AuthToken)) {
            const token = await getToken(userdata);
            if (token) {
                localStorage.setItem('token', token);
            } else {
                return null;
            }
        }
        console.log(`${api_link}/responses/id/${id}`)
        const responseOrder = await fetch(`${api_link}/responses/id/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                "greetings": responseText
            }),
            headers: {"Authorization": AuthToken, "Content-Type": "application/json"},
        })

        if (!responseOrder.ok) {
            console.error(responseOrder.status);
            throw new Error("Ошибка при отклике");
        }
        const result = await responseOrder.json();
        console.log("Response order result:", result);
        console.log("Response order text:", result.response_id);

        const editOrder = {
            is_responded: true,
        }

        const responseEditOrder = await fetch(`${api_link}/orders/id/${id}`, {
            method: "PUT",
            body: JSON.stringify(editOrder),
            headers: {"content-type": 'application/json', "Authorization": AuthToken },
        })

        console.log("Response status:", responseEditOrder.status);
        console.log("Response headers:", responseEditOrder.headers);

        if (responseEditOrder.status != 401) {
            console.error(responseEditOrder.status);
            throw new Error("Ошибка при отклике");
        }

        return result.response_id;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const getResponses = async (userdata: string): Promise<Responses[] | []> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return [] // navigate auth page
        }
        if (isTokenExpired(AuthToken)) {
            const token = await getToken(userdata);
            if (token) {
                localStorage.setItem('token', token);
            } else {
                return []
            }
        }
        const ResponseOrders = await fetch(`${api_link}/responses/list`, {
            method: "GET",
            headers: {"Authorization": AuthToken },
        });

        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            const errorText = await ResponseOrders.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }
        const data = await ResponseOrders.json();
        console.log("Сохраняем заказы в состояние:", data);
        console.warn(data)

        return data || [];
    } catch (error) {
        console.error(error);
        return []
    }
}

export const setStatus = async (userdata: string | undefined, status: boolean): Promise<boolean> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return false // navigate auth page
        }
        if (isTokenExpired(AuthToken)) {
            const token = await getToken(userdata);
            if (token) {
                localStorage.setItem('token', token);
            } else {
                return false;
            }
        }
        const ResponseOrders = await fetch(`${api_link}/users/tutor/active`, {
            method: "POST",
            body: JSON.stringify({
                "is_active": status
            }),
            headers: {"Authorization": AuthToken,
                "Content-Type": 'application/json',
            },
        });
        console.log("Status:", status);
        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            const errorText = await ResponseOrders.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }

        return ResponseOrders.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const setName = async (userdata: string | undefined, name: string): Promise<boolean> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return false // navigate auth page
        }
        if (isTokenExpired(AuthToken)) {
            const token = await getToken(userdata);
            if (token) {
                localStorage.setItem('token', token);
            } else {
                return false;
            }
        }
        const ResponseOrders = await fetch(`${api_link}/users/tutor/name`, {
            method: "POST",
            body: JSON.stringify({
                "name": name
            }),
            headers: {"Authorization": AuthToken,
                "Content-Type": 'application/json',
            },
        });

        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            const errorText = await ResponseOrders.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }

        return ResponseOrders.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const setBio = async (userdata: string | undefined, bio: string): Promise<boolean> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return false // navigate auth page
        }
        if (isTokenExpired(AuthToken)) {
            const token = await getToken(userdata);
            if (token) {
                localStorage.setItem('token', token);
            } else {
                return false;
            }
        }
        const ResponseOrders = await fetch(`${api_link}/users/tutor/bio`, {
            method: "POST",
            body: JSON.stringify({
                "bio": bio
            }),
            headers: {"Authorization": AuthToken,
                "Content-Type": 'application/json',
            },
        });

        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            const errorText = await ResponseOrders.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }

        return ResponseOrders.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const setTags = async (userdata: string | undefined, tags: string[]): Promise<boolean> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return false // navigate auth page
        }
        const ResponseOrders = await fetch(`${api_link}/users/tutor/tags`, {
            method: "POST",
            body: JSON.stringify({
                "tags": tags
            }),
            headers: {"Authorization": AuthToken,
                "Content-Type": 'application/json',
            },
        });

        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            const errorText = await ResponseOrders.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }

        return ResponseOrders.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const getProfile = async (userdata: string | undefined): Promise<TutorProfile | null> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return null // navigate auth page
        }
        const ResponseOrders = await fetch(`${api_link}/users/tutor/profile`, {
            method: "GET",
            headers: {
                "Authorization": AuthToken,
            },
        });

        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            const errorText = await ResponseOrders.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }

        const data = await ResponseOrders.json();
        console.log("Сохраняем заказы в состояние:", data);
        console.warn(data)

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const setReviewStatus = async (userdata: string | undefined, id: string): Promise<boolean> => {
    try {
        const AuthToken = localStorage.getItem("token");
        if (!AuthToken || !userdata) {
            return false // navigate auth page
        }
        const ResponseOrders = await fetch(`${api_link}/users/review/activate`, {
            method: "POST",
            body: JSON.stringify({
                "review_id": id,
            }),
            headers: {
                "Authorization": AuthToken,
                "Content-Type": 'application/json',
            },
        });

        console.log("Response status:", ResponseOrders.status);
        console.log("Response headers:", ResponseOrders.headers);

        if (!ResponseOrders.ok) {
            const errorText = await ResponseOrders.text();
            throw new Error(errorText || 'Не удалось загрузить заказы');
        }

        return ResponseOrders.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
}