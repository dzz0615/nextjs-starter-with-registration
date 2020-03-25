import React, { useState } from 'react';
import { Col, Spin, Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Router from 'next/router';
import Link from 'next/link';
import { setToken } from '../utils/request';

const Header = styled.h1`
  height: 150px;
  line-height: 150px;
  text-align: center;
  vertical-align: middle;
`;

const ErrorAlert = styled(Alert)`
  height: 40px;
  margin-bottom: 10px;
`;

export default () => {
  const [form] = Form.useForm();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async values => {
    setError();
    setIsLoading(true);

    try {
      const res = await fetch('/api/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        const { token } = await res.json();
        setToken(token);
        return Router.push('/');
      } else {
        // incorrect credentials
        form.resetFields();
        setError(await res.text());
      }
    } catch (e) {
      // bad connection
      setError('Cannot connect to network, please try again later.');
    }

    setIsLoading(false);
  };

  return (
    <>
      <Header>Login</Header>
      <Col span={10} offset={7}>
        <ErrorAlert
          style={{ visibility: error ? 'visible' : 'hidden' }}
          message={error}
          type="error"
          showIcon
        />
        <Spin spinning={isLoading}>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="email"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please input a valid email',
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please input your password',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >
                Submit
              </Button>
              Or{' '}
              <Link href="/register">
                <a>register now!</a>
              </Link>
            </Form.Item>
          </Form>
        </Spin>
      </Col>
    </>
  );
};
