// 2) Web Serial API Declarations
declare global {
  interface SerialPort {
    open(options: {
      baudRate: number;
      dataBits?: number;
      stopBits?: number;
      parity?: "none" | "even" | "odd";
      flowControl?: "none" | "hardware";
    }): Promise<void>;
    close(): Promise<void>;
    readonly readable: ReadableStream<Uint8Array>;
    readonly writable: WritableStream<Uint8Array>;
  }

  interface Serial {
    requestPort(options?: {
      filters?: Array<{ usbVendorId?: number; usbProductId?: number }>;
    }): Promise<SerialPort>;
    getPorts(): Promise<SerialPort[]>;
  }

  interface Navigator {
    // Extend navigator to include the 'serial' object
    serial: Serial;
  }
}

export {};
