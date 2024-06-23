import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardHeader,
    CardBody,
    Image,
    Divider,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from '@nextui-org/react';
import { deleteSubscription as deleteSubscriptionApi, initKeycloak, getSubscriptions } from '../auth/keycloak';
import '../globals.css';

interface SubscriptionCardProps {
    subscriptionId: string;
    serviceName: string;
    amount: number;
    currency: string;
    nextPaymentDate: string;
    category: {
        categoryName: string;
    };
    onDelete: (subscriptionId: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
                                                               subscriptionId,
                                                               serviceName,
                                                               amount,
                                                               currency,
                                                               nextPaymentDate,
                                                               category,
                                                               onDelete
                                                           }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
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

    const handleUpdate = () => {
        console.log('Update action');
    };

    const handleDelete = async () => {
        try {
            await onDelete(subscriptionId);
            onClose();
        } catch (error) {
            console.error('Failed to delete subscription:', error);
        }
    };

    return (
        <Card className="card">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h1 className="uppercase font-bold">{serviceName}</h1>
                <Divider />
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
                        src={logoUrl || "https://via.placeholder.com/270x160.png?text=Brand+Image+Not+Found"}
                        width={60}
                    />
                )}
            </CardBody>
            <CardBody className="px-4 py-2 font-bold">
                <h3>Next Payment Date: {new Date(nextPaymentDate).toLocaleDateString()}</h3>
            </CardBody>
            <CardBody className="relative w-full p-3 flex-auto flex-row place-content-end align-items-center h-auto break-words text-left overflow-y-auto subpixel-antialiased px-4 py-2 flex">
                <Button
                    size="sm"
                    color="secondary"
                    variant="ghost"
                    onClick={handleUpdate}
                    style={{ minWidth: '70px', marginRight: '10px' }}
                >
                    Update
                </Button>
                <Button
                    size="sm"
                    color="danger"
                    variant="ghost"
                    onClick={onOpen}
                    style={{ minWidth: '70px' }}
                >
                    Delete
                </Button>
            </CardBody>

            <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
                <ModalContent className="dark">
                    {onClose => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white">Are you sure?</ModalHeader>
                            <ModalBody className="text-white">
                                <p>Are you sure you want to delete this subscription?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onClick={handleDelete}>
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </Card>
    );
};

export default SubscriptionCard;
