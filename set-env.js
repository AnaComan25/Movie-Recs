const fs = require('fs');
// 1. ADD THIS LINE SO NODE KNOWS WHAT 'path' MEANS:
const path = require('path'); 

// 2. This safely forces Node to find your hidden .env file
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const targetPath = './src/environments/environment.ts';

const envConfigFile = `export const environment = {
  production: true,
  movieDBApiKey: '${process.env.MOVIE_DB_API_KEY}',
  supabaseApiKey: '${process.env.SUPABASE_API_KEY}',
  supabaseURL: '${process.env.SUPABASE_URL}'
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(err);
   }
   console.log(`Angular environment file generated dynamically with 3 variables.`);
});
