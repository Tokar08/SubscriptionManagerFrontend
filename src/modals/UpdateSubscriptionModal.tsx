import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    SelectItem,
    Select,
    DateInput
} from '@nextui-org/react';
import { updateSubscription } from '../auth/keycloak';
import { ISubscription } from '../interfaces/ISubscription';
import { parseDate } from '@internationalized/date';
import {UpdateSubscriptionModalProps} from "../interfaces/IUpdateSubscriptionModalProps";
import {currencies} from "../data/currencies";


const UpdateSubscriptionModal: React.FC<UpdateSubscriptionModalProps> = ({ isOpen, onClose, onUpdate, categories, subscription }) => {
    const [updatedSubscription, setUpdatedSubscription] = useState<ISubscription>({
        serviceName: '',
        nextPaymentDate: '',
        amount: 0,
        currency: '',
        category: {
            categoryId: '',
            categoryName: '',
        },
        subscriptionId: '',
    });

    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string | undefined }>({
        serviceName: undefined,
        nextPaymentDate: undefined,
        amount: undefined,
        currency: undefined,
        categoryId: undefined,
    });

    useEffect(() => {
        if (subscription) {
            try {
                const { nextPaymentDate, ...rest } = subscription;
                setUpdatedSubscription({
                    ...rest,
                    nextPaymentDate: nextPaymentDate.split('T')[0],
                });
            } catch (error) {
                console.error('Error parsing subscription data:', error);
            }
        }
    }, [subscription]);

    const handleUpdate = async () => {
        try {
            const isValid = validateForm();
            if (!isValid) {
                return;
            }

            const subscriptionData = {
                serviceName: updatedSubscription.serviceName,
                nextPaymentDate: `${updatedSubscription.nextPaymentDate}T00:00:00`,
                amount: updatedSubscription.amount,
                currency: updatedSubscription.currency,
                categoryId: updatedSubscription.category.categoryId
            };

            console.log('Updating subscription with ID:', updatedSubscription.subscriptionId);
            console.log('Subscription data:', subscriptionData);

            await updateSubscription(updatedSubscription.subscriptionId, subscriptionData);

            onUpdate();
            onClose();
        } catch (error) {
            console.error('Failed to update subscription:', error);
        }
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const errors: { [key: string]: string | undefined } = {};

        if (!updatedSubscription.serviceName) {
            errors.serviceName = 'Service Name is required.';
            isValid = false;
        }

        if (!updatedSubscription.nextPaymentDate) {
            errors.nextPaymentDate = 'Please enter a valid date.';
            isValid = false;
        }

        if (!updatedSubscription.amount) {
            errors.amount = 'Amount is required.';
            isValid = false;
        }

        if (!updatedSubscription.currency) {
            errors.currency = 'Currency is required.';
            isValid = false;
        }

        if (!updatedSubscription.category.categoryId) {
            errors.categoryId = 'Category is required.';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleDateChange = (date: any) => {
        if (date) {
            const formattedDate = `${date.year}-${date.month + 1}-${date.day}`;
            setUpdatedSubscription({
                ...updatedSubscription,
                nextPaymentDate: formattedDate,
            });
        } else {
            setUpdatedSubscription({
                ...updatedSubscription,
                nextPaymentDate: '',
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
            <ModalContent className="dark">
                <ModalHeader className="flex flex-col gap-1 text-white">Update Subscription</ModalHeader>
                <ModalBody className="text-white">
                    <Input
                        label="Service Name"
                        placeholder="Enter service name"
                        value={updatedSubscription.serviceName}
                        onChange={(e) => setUpdatedSubscription({ ...updatedSubscription, serviceName: e.target.value })}
                        fullWidth
                        isRequired
                        isInvalid={!!validationErrors.serviceName}
                        errorMessage={validationErrors.serviceName}
                    />
                    <DateInput
                        label="Next Payment Date"
                        fullWidth
                        isRequired
                        errorMessage={validationErrors.nextPaymentDate}
                        value={updatedSubscription.nextPaymentDate ? parseDate(`${updatedSubscription.nextPaymentDate}`) : undefined}
                        onChange={handleDateChange}
                    />

                    <div className="flex gap-4">
                        <Input
                            label="Amount"
                            type="number"
                            placeholder="Enter amount"
                            value={updatedSubscription.amount.toString()}
                            onChange={(e) => setUpdatedSubscription({ ...updatedSubscription, amount: parseFloat(e.target.value) })}
                            fullWidth
                            isRequired
                            isInvalid={!!validationErrors.amount}
                            errorMessage={validationErrors.amount}
                        />
                        <Select
                            label="Currency"
                            selectedKeys={[updatedSubscription.currency]}
                            onChange={(e) => setUpdatedSubscription({ ...updatedSubscription, currency: e.target.value })}
                            fullWidth
                            isRequired
                            isInvalid={!!validationErrors.currency}
                            errorMessage={validationErrors.currency}

                        >
                            {currencies.map(currency => (
                                <SelectItem key={currency.value} value={currency.value} className="dark">
                                    {currency.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <Select
                        label="Category"
                        selectedKeys={[updatedSubscription.category.categoryId]}
                        onChange={(e) => setUpdatedSubscription({
                            ...updatedSubscription,
                            category: { ...updatedSubscription.category, categoryId: e.target.value }
                        })}
                        fullWidth
                        isRequired
                        isInvalid={!!validationErrors.categoryId}
                        errorMessage={validationErrors.categoryId}
                    >
                        {categories.map(category => (
                            <SelectItem key={category.categoryId} value={category.categoryId} className="dark">
                                {category.categoryName}
                            </SelectItem>
                        ))}
                    </Select>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button color="primary" onPress={handleUpdate}>
                        Update
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UpdateSubscriptionModal;
