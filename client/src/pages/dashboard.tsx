import React from 'react';
import { Plus } from 'react-feather';
import { useRouter } from 'next/router';
import Link from 'next/link';

import withApollo from '../lib/withApollo';
import { useDashboardQuery } from '../generated/graphql';
import { LoggedInLayout } from '../layouts/LoggedInLayout';
import { Typography, BoxButton, Grid, Box } from '../ui';
import { RubyIcon } from '../ui/icons/RubyIcon';
import { PHPIcon } from '../ui/icons/PHPIcon';
import { NodeIcon } from '../ui/icons/NodeIcon';
import { DigitalOceanIcon } from '../ui/icons/DigitalOceanIcon';
import { PostgreSQLIcon } from '../ui/icons/PostgreSQLIcon';
import { serverTypeReadableName } from '../utils';
import { Protected } from '../modules/auth/Protected';

const Dashboard = () => {
  const router = useRouter();
  const { data, loading, error } = useDashboardQuery({});

  // TODO show loading
  // TODO handle error

  const handleCreateFirstApp = () => {
    router.push('/onboarding/cloud-provider');
  };

  return (
    <LoggedInLayout
      breadcrumb={[
        {
          label: 'Dashboard',
        },
      ]}
    >
      {data?.servers?.length === 0 ? (
        <Grid
          fullHeight={true}
          rowGap={40}
          justifyContent="center"
          justifyItems="center"
          alignContent="center"
          flexGrow={1}
        >
          <Typography.Paragraph marginBottom={0} textAlign="center">
            First thing first!
          </Typography.Paragraph>
          <BoxButton
            onClick={handleCreateFirstApp}
            icon={<Plus />}
            label="Create a new app"
            size="large"
          />
          <Grid templateColumns="24px 24px 24px" columnGap={32}>
            <RubyIcon opacity={0.2} />
            <PHPIcon opacity={0.2} />
            <NodeIcon opacity={0.2} />
          </Grid>
        </Grid>
      ) : (
        <Box
          margin={80}
          marginLeft="auto"
          marginRight="auto"
          paddingLeft={24}
          paddingRight={24}
          maxWidth={960}
          width="100%"
        >
          <Grid rowGap={80}>
            {data?.servers.map((server) => (
              <Grid
                templateColumns={{
                  desktop: '240px 1fr',
                  tablet: '1fr',
                  phone: '1fr',
                }}
                columnGap={40}
                rowGap={40}
                key={server.id}
              >
                <Box>
                  <Typography.Label marginBottom={16}>&nbsp;</Typography.Label>
                  <Grid templateColumns="24px 1fr" columnGap={16}>
                    <DigitalOceanIcon size={24} />
                    <Box>
                      <Typography.Headline level={3} marginBottom={8}>
                        <Link
                          href="/server/[serverId]"
                          as={`/server/${server.id}`}
                          passHref
                        >
                          <a>{server.name}</a>
                        </Link>
                      </Typography.Headline>

                      <Typography.Caption marginBottom={4}>
                        Running on <b>{serverTypeReadableName(server.type)}</b>
                      </Typography.Caption>
                      {server.ip && (
                        <Typography.Caption>
                          ip address—{server.ip}
                        </Typography.Caption>
                      )}
                    </Box>
                  </Grid>
                </Box>

                <Grid
                  templateColumns={{
                    desktop: '1fr 1fr',
                    tablet: '1fr 1fr',
                    phone: '1fr',
                  }}
                  columnGap={40}
                  rowGap={40}
                >
                  <Box>
                    <Typography.Label marginBottom={16} opacity={0.5}>
                      Apps
                    </Typography.Label>
                    <Grid templateColumns="1fr 1fr" columnGap={16} rowGap={16}>
                      {server.apps?.map((app) => (
                        <BoxButton
                          key={app.id}
                          label={app.name}
                          icon={<NodeIcon size={24} />}
                        />
                      ))}

                      <BoxButton
                        label="New App"
                        icon={<Plus />}
                        onClick={() =>
                          router.push(`/server/${server.id}/create-app`)
                        }
                      />
                    </Grid>
                  </Box>

                  <Box>
                    <Typography.Label marginBottom={16} opacity={0.5}>
                      Databases
                    </Typography.Label>
                    <Grid templateColumns="1fr 1fr" columnGap={16} rowGap={16}>
                      {server.databases?.map((database) => (
                        <BoxButton
                          key={database.id}
                          label={database.name}
                          icon={<PostgreSQLIcon size={24} />}
                        />
                      ))}
                      <BoxButton
                        label="New Database"
                        icon={<Plus />}
                        onClick={() =>
                          router.push(`/server/${server.id}/create-database`)
                        }
                      />
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            ))}

            <BoxButton
              label="Create a new server"
              icon={<Plus />}
              onClick={() => router.push(`/onboarding/create-server`)}
            />
          </Grid>
        </Box>
      )}
    </LoggedInLayout>
  );
};

export default withApollo(() => (
  <Protected>
    <Dashboard />
  </Protected>
));
