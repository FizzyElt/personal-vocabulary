import { Box, Text, VStack, Flex, Spacer, IconButton, HStack } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

export default function WordCard({ word, onClick, onEdit, onDelete }) {
  return (
    <Box as="section" borderRadius="md" borderWidth={1} p={2} onClick={onClick}>
      <VStack align="stretch">
        <Flex>
          <Text>{word.word}</Text>
          <Spacer />
          <HStack>
            <Text>{word.reviewCount}</Text>
            <IconButton
              size="xs"
              icon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            />
            <IconButton
              size="xs"
              colorScheme="red"
              icon={<DeleteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            />
          </HStack>
        </Flex>
        <Text>{word.translation}</Text>
      </VStack>
    </Box>
  );
}
