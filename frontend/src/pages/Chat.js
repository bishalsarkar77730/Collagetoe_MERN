import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../Components/Sidebar/Sidebar";
import MessageForm from "../Components/Message/MessageForm";

function Chat() {
  return (
    <Container>
      <Row>
        <Col md={4}>
          <Sidebar />
        </Col>
        <Col md={8}>
          <MessageForm />
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;
