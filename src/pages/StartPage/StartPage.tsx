import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { getOrders, Activate } from '@/api/Orders.ts';
import { Order } from '@/models/Order.ts';
import { Page } from '@/components/Page.tsx';
import styles from '@/pages/MyOrdersPage.module.css';
import { Banner, Headline, Button, Placeholder } from '@telegram-apps/telegram-ui';
import {initData, useSignal} from "@telegram-apps/sdk-react";
import { useNavigate } from 'react-router-dom';
import {ValidateInitData} from "@/api/auth.tsx";

export const StartPage: FC = () => {
    const [LoadOrder, SetNeworders] = useState<Order[]>([]);
    const [IsLoading, SetIsLoading] = useState<boolean>(true);
    const initDataRaw = useSignal<string | undefined>(initData.raw);
    const navigate = useNavigate();

    console.log('StartPage component rendered');

    useEffect(() => {
        const authenticate = async () => {
            if (!initDataRaw) {
                alert('Ошибка авторизации.');
                return;
            }
            try {
                // Класть init data куда-то?
                const request_status = await ValidateInitData(initDataRaw);
                if (request_status) {
                    navigate('/orders');
                } else {
                    console.error('Authorization failed');
                    alert('Не удалось выполнить авторизацию.');
                }
            } catch (error) {
                console.error('Authorization failed:', error);
                alert('Не удалось выполнить авторизацию.');
            }
        };

        authenticate();
    }, [initDataRaw, navigate]);


    useEffect(() => {
        console.log('useEffect triggered');
        const LoadOrders = async () => {
            console.log('LoadOrders started');
            try {
                console.log('Calling getOrders');
                const data = await getOrders();
                console.log('Orders fetched:', data);
                if (data == null) {
                    console.log('No orders received, setting empty array');
                    SetNeworders([]);
                } else {
                    console.log('Setting orders:', data);
                    SetNeworders(data);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                console.log('Setting IsLoading to false');
                SetIsLoading(false);
            }
        };

        console.log('Calling LoadOrders');
        LoadOrders();
    }, [initDataRaw]);

    useEffect(() => {
        console.log('LoadOrder state updated:', LoadOrder);
    }, [LoadOrder]);

    const handleActivate = async (orderId: string) => {
        try {
            const status = await Activate(orderId);
            console.log(`Activate status for order ${orderId}:`, status);
            if (status) {
                alert('good');
            } else {
                alert('bad');
            }
        } catch (err) {
            console.error(`Failed to activate order ${orderId}:`, err);
            alert('Failed to activate order');
        }
    };

    return (
        <Page back={false}>
            <div>
                <Headline weight="1">Доступные заказы</Headline>
            </div>
            {IsLoading ? (
                <Headline weight="1">Загрузка...</Headline>
            ) : LoadOrder.length === 0 ? (
                <div className={styles.noOrders}>
                    <Placeholder header="Нет ни одного заказа">
                        <img
                            alt="Telegram sticker"
                            className="blt0jZBzpxuR4oDhJc8s"
                            src="https://xelene.me/telegram.gif"
                        />
                    </Placeholder>
                </div>
            ) : (
                <div className={styles.orderList}>
                    {LoadOrder.map((order) => (
                        <Banner
                            key={order.id}
                            header={order.title}
                            subheader={`Цена мин: ${order.min_price} макс: ${order.max_price}`}
                            description={order.description}
                            className={styles.orderItem}
                        >
                            <div className={styles.bannerContent}>
                                {order.tags && order.tags.length > 0 && (
                                    <div className={styles.tagsContainer}>
                                        {order.tags.map((tag, tagIndex) => (
                                            <span key={tagIndex} className={styles.tag}>
                                                {tag
                                                    .replace(/_/g, ' ')
                                                    .split(' ')
                                                    .map((word, index) =>
                                                        index === 0
                                                            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                                            : word.toLowerCase()
                                                    )
                                                    .join(' ')}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <Button
                                    mode="filled"
                                    size="s"
                                    onClick={() => handleActivate(order.id)}
                                    className={styles.activateButton}
                                >
                                    Activate
                                </Button>
                            </div>
                        </Banner>
                    ))}
                </div>
            )}
        </Page>
    );
};