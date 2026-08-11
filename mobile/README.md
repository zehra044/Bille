# Bille Mobile Frontend

A simple Expo mobile frontend for the Bille backend.

## Setup

1. Install dependencies:
   ```bash
   cd mobile
   npm install
   ```

2. Update the API base URL in `mobile/src/api.ts`.
   - For Android emulator: `http://10.0.2.2:5000`
   - For iOS simulator: `http://localhost:5000`
   - For a real device: use your machine IP, e.g. `http://192.168.x.x:5000`

3. Start the app:
   ```bash
   npm start
   ```

4. Open in Expo Go or an emulator.

## Included screens

- Home menu
- Customers list
- Customer profile and transactions
- Create / edit customer
- Create transactions (charge, payment, adjustment)
- Dashboard summary
- Reports: outstanding balances, daily and monthly collections
- Trash viewer with permanent delete
- Backup export and restore

## Notes

- This frontend expects the backend to already be running on port `5000`.
- The app currently focuses on active customers and transactions; advanced trash and backup features can be added later.
