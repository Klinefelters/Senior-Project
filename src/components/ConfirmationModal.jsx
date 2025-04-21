import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
  } from '@chakra-ui/react'

import { use, useEffect } from 'react';

export default function MicrophoneButton({ isOpen, onClose, submit, text, setText }) {
    useEffect(() => {
        const formattedText = text.charAt(0).toUpperCase() + text.slice(1).trim();
        const finalText = formattedText.endsWith('.') ? formattedText : formattedText + '.';
        setText(finalText);
    }, [isOpen]);

    const handleYes = async () => {
        setText()
        onClose();
        await submit({ preventDefault: () => {} });
    };
    const handleNo = () => {
        setText("");
        onClose();
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={"50px"}>Is This Correct?</ModalHeader>
                <ModalCloseButton />
                <ModalBody fontSize={"3vw"}>
                    {text}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleYes}>
                        Yes
                    </Button>
                    <Button variant='ghost' onClick={handleNo}>No</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}