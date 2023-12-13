import React, {useState, useEffect} from 'react'
import { Card, Button, Container, Form } from 'react-bootstrap';

export function JobApplyForm() {

    return (
        <Container>
            <Card>
                <Card.Body>
                    <Form>
                        <h4>Add your contact information</h4>
                        <Form.Label>First name</Form.Label>
                        <Form.Control type='text' required />
                        <Form.Label>Last name</Form.Label>
                        <Form.Control type='text' required />
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email" />
                        <Form.Label>City (optional)</Form.Label>
                        <Form.Control type='text' />
                        <label for="phone" class="form-label">Phone number</label>
                        <input type="text" class="form-control" id="phone" name="phone" />
                        <br />
                        <button type="submit" class="btn btn-primary w-100">Continue</button>


                    </Form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Form>
                        <h3>Add a resume for the employer</h3>

                        <Container type='button' style={{border:'solid 1px navy', padding:'10px', borderRadius:'15px'}}>
                            <h4>Upload a resume</h4>
                            <p>Accepted file types: PDF, DOCX</p>
                        </Container>
                        <p>Or</p>
                        <Container type='button' style={{border:'solid 1px navy', padding:'10px', borderRadius:'15px'}}>
                            <p>Recommended</p>
                            <h4>Build a Logoipsum Resume</h4>
                            <p>We’ll guide you through it, there are only a few steps</p>
                        </Container>
                        <p>Or</p>
                        <Container type='button' style={{border:'solid 1px navy', padding:'10px', borderRadius:'15px'}}> 
                            <h4>Continue without a resume</h4>
                            <p>We highly recommend that you provide a resume!</p>
                        </Container>
                        <br />
                        <button type="submit" class="btn btn-primary w-100">Continue</button>

                    </Form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Form>
                        <h4>Build your resume (1 of 4)</h4>
                        <h4>Do you want to add any education details?</h4>

                        <Form.Label>Level of education *</Form.Label>
                        <Form.Control type='text' required />
                        <Form.Label>Field of study</Form.Label>
                        <Form.Control type='text' required />
                        <Form.Label>Name of school</Form.Label>
                        <Form.Control type='text' required />

                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email" />
                        <Form.Label>City (optional)</Form.Label>
                        <Form.Control type='text' />
                        <label for="phone" class="form-label">Phone number</label>
                        <input type="text" class="form-control" id="phone" name="phone" />
                        <br />
                        <button type="submit" class="btn btn-primary w-100">Continue</button>


                    </Form>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Form>
                        <p>Build your resume (3 of 4)</p>
                        <label for="phone" class="form-label">Phone number</label>
                        <input type="text" class="form-control" id="phone" name="phone" />
                        <Button >+</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}
