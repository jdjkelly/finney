export interface EnumerateSigners {
  signers: [
    {
      // Master key fingerprint
      fingerprint: string;
      // Device name
      name: string;
    }
  ];
};
