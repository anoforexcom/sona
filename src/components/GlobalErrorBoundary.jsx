import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ p: 4, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8d7da', color: '#721c24' }}>
                    <Typography variant="h4" gutterBottom>Something went wrong.</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>The application crashed.</Typography>
                    <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #f5c6cb', width: '100%', maxWidth: '600px', overflow: 'auto' }}>
                        <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
                            {this.state.error && this.state.error.toString()}
                        </Typography>
                        <br />
                        <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </Typography>
                    </Box>
                    <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 3 }}>
                        Reload Page
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
