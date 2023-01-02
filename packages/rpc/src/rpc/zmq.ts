export type getzmqnotifications = [{
  // Type of notification
  type: string;
  // Address of the publisher
  address: string;
  // Outbound message high water mark
  hwm: number;
}];