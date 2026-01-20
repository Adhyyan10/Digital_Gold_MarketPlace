import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
                    <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl text-center">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
                        <p className="text-gray-400 mb-6">
                            The application encountered an unexpected error. We've logged this issue.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-xl transition"
                        >
                            Reload Application
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-6 text-left bg-gray-950 p-4 rounded-lg overflow-auto max-h-48 text-xs font-mono text-red-400">
                                {this.state.error.toString()}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
