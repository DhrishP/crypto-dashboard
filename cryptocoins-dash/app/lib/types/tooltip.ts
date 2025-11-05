export interface TooltipPayload {
  value: number;
  payload: {
    date: string;
    time: string;
    price: number;
    btcPrice: number | null;
  };
  dataKey?: string;
  color?: string;
}

export interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}
