// Extends backendInterface and Backend class to include internal initialization method
// This method is called by the generated useActor.ts hook for access control setup.
declare module "../backend" {
  interface backendInterface {
    _initializeAccessControlWithSecret(adminToken: string): Promise<void>;
  }
  interface Backend {
    _initializeAccessControlWithSecret(adminToken: string): Promise<void>;
  }
}

export {};
