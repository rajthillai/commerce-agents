# CommerceCraft AI

CommerceCraft AI is a powerful AI-powered development tool for Adobe Commerce (Magento) that helps automate and streamline the module development process. It uses advanced AI agents to generate technical approaches and develop Commerce modules based on functional requirements.

## Features

- AI-powered technical approach generation
- Automated module development
- Integration with Adobe Commerce
- Modern UI with Next.js and Tailwind CSS
- TypeScript support
- Firebase integration

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Adobe Commerce 2.4.x installation
- Google AI API key (for Genkit integration)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/commerce-agents.git
   cd commerce-agents
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key
   COMMERCE_SRC_DIR=/path/to/your/commerce/src/app/code
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
commerce-agents/
├── src/
│   ├── ai/              # AI agent implementations
│   ├── components/      # React components
│   ├── lib/            # Utility functions
│   └── app/            # Next.js app directory
├── .genkit/            # Genkit configuration
├── public/             # Static assets
└── src/app/code/       # Generated Commerce modules
```

## Usage

1. Configure your project:
   - Enter project name
   - Enter module name
   - Upload functional requirements CSV

2. Generate Technical Approach:
   - Click "Generate Technical Approach" button
   - Review the generated technical approach

3. Develop Commerce Module:
   - Click "Develop Commerce Module" button
   - Review the generated module code
   - Export or open in Commerce directory

## Development

### Available Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run genkit:dev` - Start the Genkit server
- `npm run genkit:watch` - Start Genkit in watch mode
- `npm run build` - Build the application for production
- `npm run start` or `npm run serve` - Start the production server (requires running `build` first)
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Production Deployment

To deploy the application to production:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   # or
   npm run serve
   ```

Note: The production server requires a build to be present in the `.next` directory. Make sure to run `npm run build` before starting the production server.

### Adding New Features

1. Create new AI agents in `src/ai/flows/`
2. Add new components in `src/components/`
3. Update the dashboard in `src/components/dashboard.tsx`

## Configuration

### Environment Variables

- `GOOGLE_GENAI_API_KEY` - Your Google AI API key
- `COMMERCE_SRC_DIR` - Path to your Adobe Commerce installation's src/app/code directory

### Commerce Integration

The application integrates with Adobe Commerce by:
1. Generating module code based on technical approaches
2. Writing files to the Commerce directory (configured via `COMMERCE_SRC_DIR` environment variable)
3. Following Magento 2 coding standards

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- Next.js
- Tailwind CSS
- Genkit
- Adobe Commerce
- Google AI
