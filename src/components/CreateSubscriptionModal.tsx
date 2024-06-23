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
import axios from 'axios';

interface CreateSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: () => void;
    categories: any[];
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({ isOpen, onClose, onCreate, categories }) => {
    const [serviceName, setServiceName] = useState('');
    const [nextPaymentDate, setNextPaymentDate] = useState<DateValue | null | undefined>(null);
    const [amount, setAmount] = useState<number | string>('');
    const [currency, setCurrency] = useState('USD');
    const [categoryId, setCategoryId] = useState('');
    const [dateError, setDateError] = useState<boolean>(false);

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem('keycloakToken');
            await axios.post('http://localhost:7878/api/v1/subscriptions', {
                serviceName,
                nextPaymentDate: nextPaymentDate?.toString(),
                amount: parseFloat(amount as string),
                currency,
                categoryId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            onCreate();
            onClose();
        } catch (error) {
            console.error('Failed to create subscription:', error);
        }
    };

    const validateDate = () => {
        if (!nextPaymentDate) {
            setDateError(true);
            return false;
        }
        setDateError(false);
        return true;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
            <ModalContent className="dark">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-white">Create Subscription</ModalHeader>
                        <ModalBody className="text-white">
                            <Input
                                label="Service Name"
                                placeholder="Enter service name"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                                fullWidth
                                isRequired
                            />
                            <DateInput
                                label="Next Payment Date"
                                value={nextPaymentDate}
                                onChange={(value) => setNextPaymentDate(value)}
                                fullWidth
                                isRequired
                                errorMessage={dateError ? "Please enter a valid date." : undefined}
                            />
                            <div className="flex gap-4">
                                <Input
                                    label="Amount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount as string}
                                    onChange={(e) => setAmount(e.target.value)}
                                    fullWidth
                                    isRequired
                                />
                                <Select
                                    label="Currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    fullWidth
                                    isRequired
                                >
                                    <SelectItem value="USD" key={1} className="dark">USD</SelectItem>
                                    <SelectItem value="ARS" key={2} className="dark">ARS</SelectItem>
                                    <SelectItem value="EUR" key={3} className="dark">EUR</SelectItem>
                                </Select>
                            </div>
                            <Select
                                className="dark"
                                label="Category"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                fullWidth
                                isRequired
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
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default CreateSubscriptionModal;
