import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody, Image, Divider } from '@nextui-org/react';
import '../globals.css';

interface SubscriptionCardProps {
    serviceName: string;
    amount: number;
    currency: string;
    nextPaymentDate: string;
    category: {
        categoryName: string;
    };
}
const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
                                                               serviceName,
                                                               amount,
                                                               currency,
                                                               nextPaymentDate,
                                                                category
                                                           }) => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const response = await axios.get(`https://api.brandfetch.io/v2/search/${serviceName}`, {
                    headers: {
                        Authorization: `Bearer NlIXKCqBi2UAqH/RF1KZ/q39fMpeSZJ8KYK41j+TQQg=`
                    }
                });

                if (response.data.length > 0) {
                    const logo = response.data[0].icon;
                    setLogoUrl(logo);
                } else {
                    setError('No logo found');
                }
            } catch (error) {
                console.error('Failed to fetch logo:', error);
                setError('Failed to fetch logo');
            }
        };

        fetchLogo();
    }, [serviceName]);

    return (
        <Card className="card">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h1 className="uppercase font-bold">{serviceName}</h1>
                <Divider/>
                <h1 className="text-large">{category.categoryName}</h1>
                <h4 className="font-bold text-large">{amount} {currency}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
            {error ? (
                    <Image
                        alt={`${serviceName} logo`}
                        className="object-cover rounded-xl"
                        src="https://via.placeholder.com/270x160.png?text=Error+Fetching+Logo"
                        width={60}
                    />
                ) : (

                    <Image
                        alt={`${serviceName} logo`}
                        className="object-cover rounded-xl"
                        src={logoUrl ||  "https://via.placeholder.com/270x160.png?text=Brand+Image+Not+Found"}
                        width={60}
                    />
                )}
            </CardBody>
            <CardBody className="px-4 py-2 font-bold">
                <h3>Next Payment Date: {new Date(nextPaymentDate).toLocaleDateString()}</h3>
            </CardBody>
        </Card>
    );
};

export default SubscriptionCard;
