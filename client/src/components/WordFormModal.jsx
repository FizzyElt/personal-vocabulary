import React, { useEffect } from 'react';
import {
  Modal,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Button,
  IconButton,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import Joi from 'joi';
import { equals } from 'ramda';
import { joiResolver } from '@hookform/resolvers/joi';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

const linkScheme = Joi.object({
  value: Joi.string().allow('').domain(),
});

const wordScheme = Joi.object({
  word: Joi.string().required(),
  translation: Joi.string().allow(''),
  links: Joi.array().items(linkScheme),
});

const defaultWordData = {
  word: '',
  translation: '',
  links: [],
};

export default function WordFormModal({
  isOpen = false,
  loading = false,
  mode = 'create',
  onClose = () => {},
  onSubmit = () => {},
  defaultFormData = defaultWordData,
}) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: defaultFormData,
    resolver: joiResolver(wordScheme),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultFormData);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader></ModalHeader>
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Controller
              control={control}
              name="word"
              render={({ field, fieldState: { error, invalid } }) => (
                <FormControl isRequired isInvalid={invalid} isReadOnly={equals(mode, 'edit')}>
                  <FormLabel>word</FormLabel>
                  <Input placeholder="input your word" {...field} />
                  <FormErrorMessage>{error?.message || ''}</FormErrorMessage>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="translation"
              render={({ field, fieldState: { error, invalid } }) => (
                <FormControl isInvalid={invalid}>
                  <FormLabel>translation</FormLabel>
                  <Input {...field} />
                  <FormErrorMessage>{error?.message || ''}</FormErrorMessage>
                </FormControl>
              )}
            />

            <VStack align="stretch">
              <Text>links</Text>
              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <Controller
                    control={control}
                    name={`links.${index}.value`}
                    render={({ field, fieldState: { invalid } }) => (
                      <HStack>
                        <Input {...field} isInvalid={invalid} />
                        <IconButton
                          colorScheme="red"
                          onClick={() => remove(index)}
                          icon={<DeleteIcon />}
                        />
                      </HStack>
                    )}
                  />
                </React.Fragment>
              ))}

              <Button w="full" onClick={() => append({ value: '' })} leftIcon={<AddIcon />}>
                new link
              </Button>
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button w="full" isLoading={loading} colorScheme="blue" onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
