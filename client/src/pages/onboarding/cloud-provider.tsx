import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSaveDigitalOceanAccessTokenMutation } from '../../generated/graphql';
import { OnboardingLayout } from '../../layouts/OnboardingLayout';
import withApollo from '../../lib/withApollo';
import { ArrowRight } from 'react-feather';
import {
  TextField,
  Button,
  styled,
  Flex,
  Typography,
  Box,
  BoxButton,
  Grid,
} from '../../ui';
import { DigitalOceanIcon } from '../../ui/icons/DigitalOceanIcon';
import { LinodeIcon } from '../../ui/icons/LinodeIcon';
import { AWSIcon } from '../../ui/icons/AWSIcon';
import { Protected } from '../../modules/auth/Protected';
import { digitalOceanAccessTokenRegExp } from '../../utils/index';

const CloudProvider = () => {
  const router = useRouter();
  const [
    saveDigitalOceanAccessTokenMutation,
  ] = useSaveDigitalOceanAccessTokenMutation();
  const digitalOceanAccessTokenSchema = yup.object().shape({
    token: yup
      .string()
      .trim()
      .min(64, 'Token too short, it should be exactly 64 characters long')
      .max(64, 'Token too long, it should be exactly 64 characters long')
      .matches(
        digitalOceanAccessTokenRegExp,
        'Whoops, invalid token format. Try entering it again'
      )
      .required('Whoops, token is missing. Try entering it again'),
  });
  const formik = useFormik<{ token: string }>({
    initialValues: {
      token: '',
    },
    validationSchema: digitalOceanAccessTokenSchema,
    onSubmit: async (values) => {
      try {
        const data = await saveDigitalOceanAccessTokenMutation({
          variables: { digitalOceanAccessToken: values.token },
        });
        console.log(data);
        router.push('/onboarding/create-server');
      } catch (error) {
        // TODO catch errors
        console.log(error);
        alert(error);
      }
    },
  });

  return (
    <OnboardingLayout
      breadcrumb={[
        {
          label: 'Pick your cloud provider',
        },
      ]}
    >
      <Form onSubmit={formik.handleSubmit}>
        <Box>
          <Typography.Label marginBottom={24}>
            Choose your first cloud provider
          </Typography.Label>
          <Grid
            templateColumns={{
              desktop: '1fr 1fr 1fr',
              tablet: '1fr 1fr 1fr',
              phone: '1fr 1fr',
            }}
            columnGap={16}
            rowGap={16}
          >
            <BoxButton
              selected={true}
              label="Digital Ocean"
              icon={<DigitalOceanIcon size={40} />}
            />
            <BoxButton
              label="Linode"
              disabled={true}
              icon={<LinodeIcon size={40} />}
            />
            <BoxButton
              label="Amazon Web Services"
              disabled={true}
              icon={<AWSIcon size={40} />}
            />
          </Grid>
          <Typography.Caption marginTop={8}>
            We currently only provide Digital Ocean as an option of cloud
            provider
          </Typography.Caption>
          <Typography.Caption marginTop={8}>
            If you are a new DigitalOcean user, you will receive $100 Free
            Credit once you sign up for the first two months.
          </Typography.Caption>
        </Box>
        <TextField
          id="token"
          name="token"
          label="Enter your access token"
          value={formik.values.token}
          onChange={formik.handleChange}
          error={formik.touched && formik.errors.token}
        />
        <Flex justifyContent="flex-end">
          <Button type="submit" background="primary" endIcon={<ArrowRight />}>
            Submit
          </Button>
        </Flex>
      </Form>
    </OnboardingLayout>
  );
};

const Form = styled.form`
  display: grid;
  grid-row-gap: 80px;

  @media ${({ theme }) => theme.media.phone} {
    grid-row-gap: 40px;
  }
`;

export default withApollo(() => (
  <Protected>
    <CloudProvider />
  </Protected>
));
