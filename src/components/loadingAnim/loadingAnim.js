import React from "react";
import './loadingAnim.css'
import { Spinner } from 'react-bootstrap';

export default function LoadingSpinner() {
    return (
        <div className="spinner-container">
            <div className="loading-spinner loader">
            <Spinner animation="border" variant="warning" />
            </div>
        </div>
    );
}