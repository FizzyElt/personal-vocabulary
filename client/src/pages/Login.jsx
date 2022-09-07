import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useForm, Controller } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import Joi from 'joi';

import { LOGIN } from '../graphql';
import { AUTH } from '../utils';

const loginScheme = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
});

export default function Login() {
  const navigate = useNavigate();
  const [login] = useMutation(LOGIN, {
    onCompleted: ({ login }) => {
      localStorage.setItem(AUTH.token, login.token);
      navigate('/');
    },
  });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: joiResolver(loginScheme),
  });

  return (
    <Box p={4}>
      <VStack align="stretch">
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState: { invalid } }) => (
            <FormControl isRequired isInvalid={invalid}>
              <FormLabel>email</FormLabel>
              <Input type="email" {...field} />
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState: { invalid } }) => (
            <FormControl isRequired isInvalid={invalid}>
              <FormLabel>password</FormLabel>
              <Input type="password" {...field} />
            </FormControl>
          )}
        />

        <Button
          onClick={handleSubmit((data) => {
            login({ variables: data });
          })}
        >
          login
        </Button>
      </VStack>
    </Box>
  );
}
