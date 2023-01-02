export interface enumeratesigners {
  signers: [
    {
      // Master key fingerprint
      fingerprint: string;
      // Device name
      name: string;
    }
  ];
};
