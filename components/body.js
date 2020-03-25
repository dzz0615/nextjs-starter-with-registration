import styled from 'styled-components';
import { Layout } from 'antd';

const ContentContainer = styled.div`
  min-height: 500px;
  padding: 25px;
  width: 100%;
`;

export default props => (
  <Layout>
    <Layout.Content>
      <ContentContainer>{props.children}</ContentContainer>
    </Layout.Content>
  </Layout>
);
