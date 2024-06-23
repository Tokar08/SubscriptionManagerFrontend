import React, { useState } from 'react';
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
    DateInput,
    DateValue
} from '@nextui-org/react';
import { createSubscription } from '../auth/keycloak';

interface CreateSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: () => void;
    categories: any[];
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({ isOpen, onClose, onCreate, categories }) => {
    const [subscription, setSubscription] = useState({
        serviceName: '',
        nextPaymentDate: null as DateValue | null | undefined,
        amount: '',
        currency: undefined as string | undefined,
        categoryId: ''
    });
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string | undefined }>({
        serviceName: undefined,
        nextPaymentDate: undefined,
        amount: undefined,
        currency: undefined,
        categoryId: undefined
    });

    const handleCreate = async () => {
        try {
            const isValid = validateForm();
            if (!isValid) {
                return;
            }

            const isoDateString = subscription.nextPaymentDate
                ? `${subscription.nextPaymentDate.year}-${
                    String(subscription.nextPaymentDate.month).padStart(2, '0')
                }-${
                    String(subscription.nextPaymentDate.day).padStart(2, '0')
                }T00:00:00`
                : null;

            const nextPaymentDate = new Date(isoDateString!);
            const now = new Date();
            if (nextPaymentDate <= now) {
                setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    nextPaymentDate: 'Please enter a valid future date.'
                }));
                return;
            }

            const subscriptionData = {
                serviceName: subscription.serviceName,
                nextPaymentDate: isoDateString,
                amount: parseFloat(subscription.amount),
                currency: subscription.currency!,
                categoryId: subscription.categoryId
            };

            console.log('Sending request to create subscription with data:', JSON.stringify(subscriptionData, null, 2));

            await createSubscription(subscriptionData);

            resetForm();
            onCreate();
            onClose();
        } catch (error) {
            console.error('Failed to create subscription:', error);
        }
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const errors: { [key: string]: string | undefined } = {};


        if (!subscription.serviceName) {
            errors.serviceName = 'Service Name is required.';
            isValid = false;
        }

        if (!subscription.nextPaymentDate || !isValidDate(subscription.nextPaymentDate)) {
            errors.nextPaymentDate = 'Please enter a valid date.';
            isValid = false;
        }

        if (!subscription.amount) {
            errors.amount = 'Amount is required.';
            isValid = false;
        }

        if (!subscription.currency) {
            errors.currency = 'Currency is required.';
            isValid = false;
        }

        if (!subscription.categoryId) {
            errors.categoryId = 'Category is required.';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const isValidDate = (date: DateValue): boolean => {
        const { year, month, day } = date;
        const selectedDate = new Date(year, month - 1, day);
        const now = new Date();
        return selectedDate > now;
    };

    const resetForm = () => {
        setSubscription({
            serviceName: '',
            nextPaymentDate: null,
            amount: '',
            currency: undefined,
            categoryId: ''
        });
        setValidationErrors({
            serviceName: undefined,
            nextPaymentDate: undefined,
            amount: undefined,
            currency: undefined,
            categoryId: undefined
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
            <ModalContent className="dark">
                <ModalHeader className="flex flex-col gap-1 text-white">Create Subscription</ModalHeader>
                <ModalBody className="text-white">
                    <Input
                        label="Service Name"
                        placeholder="Enter service name"
                        value={subscription.serviceName}
                        onChange={(e) => setSubscription({ ...subscription, serviceName: e.target.value })}
                        fullWidth
                        isRequired
                        isInvalid={!!validationErrors.serviceName}
                        errorMessage={validationErrors.serviceName}
                    />
                    <DateInput
                        label="Next Payment Date"
                        value={subscription.nextPaymentDate}
                        onChange={(value) => setSubscription({ ...subscription, nextPaymentDate: value })}
                        fullWidth
                        isRequired
                        isInvalid={!!validationErrors.nextPaymentDate}
                        errorMessage={validationErrors.nextPaymentDate}
                    />
                    <div className="flex gap-4">
                        <Input
                            label="Amount"
                            type="number"
                            placeholder="Enter amount"
                            value={subscription.amount as string}
                            onChange={(e) => setSubscription({ ...subscription, amount: e.target.value })}
                            fullWidth
                            isRequired
                            isInvalid={!!validationErrors.amount}
                            errorMessage={validationErrors.amount}
                        />
                        <Select
                            label="Currency"
                            value={subscription.currency}
                            onChange={(e) => setSubscription({ ...subscription, currency: e.target.value })}
                            fullWidth
                            isRequired
                            isInvalid={!!validationErrors.currency}
                            errorMessage={validationErrors.currency}
                        >
                            <SelectItem value="USD" key={'USD'} className="dark">USD</SelectItem>
                            <SelectItem value="ARS" key={'ARS'} className="dark">ARS</SelectItem>
                            <SelectItem value="EUR" key={'EUR'} className="dark">EUR</SelectItem>
                        </Select>
                    </div>
                    <Select
                        className="dark"
                        label="Category"
                        value={subscription.categoryId}
                        onChange={(e) => setSubscription({ ...subscription, categoryId: e.target.value })}
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
                    <Button color="primary" onPress={handleCreate}>
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateSubscriptionModal;
