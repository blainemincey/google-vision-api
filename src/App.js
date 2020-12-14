import axios from 'axios';
import React, {Component} from 'react';
import {Container, Row, Col, Button, Form, FormGroup, FormFile, Image} from 'react-bootstrap';

class App extends Component {

    state = {

        // Initially, no file is selected
        selectedFile: '',
        isUploaded: false,
        message: '',
        imgId: '',
        imgUri: '',
        username: '',
        isLandmark: false,
        landmarkMessage: '',
        landmarkDescription: ''
    };

    // clear all
    onClear = () => {
        this.setState({
            selectedFile: '',
            isUploaded: false,
            message: '',
            imgId: '',
            imgUri: '',
            username: '',
            isLandmark: '',
            landmarkMessage: '',
            landmarkDescription: ''
        })
    }

    // On file select (from the pop up)
    onFileChange = event => {
        if(event.target.files[0] !== null || event.target.files[0] !== '') {
            // Update the state
            this.setState({selectedFile: event.target.files[0]});
        }
    };

    // On file upload (click the upload button)
    onFileUpload = () => {
        if(this.state.selectedFile !== '') {
            // Create an object of formData
            const formData = new FormData();

            // Update the formData object
            formData.append(
                "file",
                this.state.selectedFile,
                this.state.selectedFile.name
            );

            // Details of the uploaded file
            console.log(this.state.selectedFile);

            // Request made to the backend api
            // Send formData object
            axios.post("http://localhost:3001/api/uploadfile", formData)
                .then(response => {
                    console.log("result: " + JSON.stringify(response));
                    this.setState({
                        isUploaded: true,
                        message: response.data.message,
                        imgId: response.data.data[0].id,
                        imgUri: response.data.data[0].imageuri,
                        username: response.data.data[0].username
                    })

                    // Request made to the backend api
                    // Send formData object
                    let imgData = {
                        imgUri: this.state.imgUri
                    }
                    axios.post("http://localhost:3001/api/vision", imgData)
                        .then(response => {
                            console.log("result: " + JSON.stringify(response));
                            this.setState({
                                isLandmark: true,
                                landmarkMessage: response.data.message,
                                landmarkDescription: response.data.data
                            })
                        });
                })

        }

    };

    // File content to be displayed after
    // file upload is complete
    fileData = () => {

        if (this.state.selectedFile) {

            return (
                <Container>
                    <Row><b>File Details</b></Row>
                    <Row><p>File Name: {this.state.selectedFile.name}</p></Row>
                    <Row><p>File Type: {this.state.selectedFile.type}</p></Row>
                    <Row>
                        <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                        </p>
                    </Row>
                </Container>
            );
        }
    };

    // File content to be displayed after
    // file upload is complete
    uploadResult = () => {

        if (this.state.isUploaded) {

            return (
                <Container>
                    <Row><b>Image Upload Results</b></Row>
                    <Row><p>{this.state.message}</p></Row>
                    <Row><p>Id: {this.state.imgId}</p></Row>
                    <Row><p>Username: {this.state.username}</p></Row>
                    <Row><p>Image Uri: {this.state.imgUri}</p></Row>
                    <Row><Image style={{width:75,height:75}} src={this.state.imgUri}/></Row>
                </Container>
            );
        }
    };

    // File content to be displayed after
    // file upload is complete
    landmarkResult = () => {

        if (this.state.isLandmark) {

            return (
                <Container>
                    <Row><b>Landmark Results</b></Row>
                    <Row><p>{this.state.landmarkMessage}</p></Row>
                    <Row><p>Landmark: {this.state.landmarkDescription}</p></Row>

                </Container>
            );
        }
    };

    render() {

        return (
            <Container>
                <Row>
                    <Col>
                        <h1>
                            MyPhotoz
                        </h1>
                        <hr/>
                        <h3>
                            Photo Upload and Environment Detection
                        </h3>
                        <hr/>
                        <div>
                            <Form>
                                <FormGroup>
                                    <FormFile type="file" onChange={this.onFileChange} />
                                    <br/>
                                    <Row>
                                        <Col>
                                    <Button onClick={this.onFileUpload}>
                                        Upload!
                                    </Button>
                                        </Col>
                                        <Col>
                                    <Button onClick={this.onClear}>
                                        Clear
                                    </Button>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Form>
                        </div>
                        {this.fileData()}
                        <br/>
                        {this.uploadResult()}
                        <br/>
                        {this.landmarkResult()}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;