import React from 'react';
import { Row, Col } from "react-bootstrap"
import Nav from "./pages/nav"
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/pages.css"

export class Pages extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (<>
            <div className="pagesC">
                <Row>
                    <Col>
                        <Nav id={this.props.id}>
                        </Nav>
                    </Col>
                </Row>
                <Row><Col>
                    { this.props.page || (<></>) }
                </Col></Row>
            </div>
            <div className="footer">tsungimd106@gmail.com</div>
        </>)
    }
}

