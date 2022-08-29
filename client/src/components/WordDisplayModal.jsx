import { useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Link,
  VStack,
  UnorderedList,
  ListItem,
  Text,
  Box,
  Divider,
} from '@chakra-ui/react';

import { increaseReviewCount } from '~/api';

export default function WordDisplayModal({ isOpen = false, onClose = () => {}, word }) {
  useEffect(() => {
    if (isOpen && word.word) {
      increaseReviewCount(word.word);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>{word?.word || ''}</ModalHeader>
        <ModalBody>
          <VStack align="stretch">
            <Box>
              <Text>translation</Text>
              <Text>{word?.translation || ''}</Text>
            </Box>
            <Divider />
            <VStack align="stretch" spacing={0}>
              <Text>links</Text>
              <UnorderedList pl={4}>
                {(word?.links || []).map((link) => (
                  <ListItem key={link}>
                    <Link href={link} color="blue.500">
                      {link}
                    </Link>
                  </ListItem>
                ))}
              </UnorderedList>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
