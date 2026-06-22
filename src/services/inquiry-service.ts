import { InquiryRepository } from '../repositories/inquiry-repository';
import { Inquiry } from '../types';

export class InquiryService {
  constructor(private repository: InquiryRepository) {}

  async submitInquiry(data: {
    bride_name: string;
    groom_name?: string;
    phone: string;
    email?: string;
    wedding_date?: string;
    venue?: string;
    budget?: string;
    message?: string;
  }): Promise<Inquiry> {
    // Validate inputs
    if (!data.bride_name.trim()) {
      throw new Error('Bride name is required.');
    }
    if (!data.phone.trim()) {
      throw new Error('Phone number is required.');
    }

    return this.repository.create(data);
  }

  getWhatsAppUrl(data: {
    bride_name: string;
    groom_name?: string;
    wedding_date?: string;
    venue?: string;
    budget?: string;
  }): string {
    const whatsappNum = '919876543210'; // Representative placeholder or can read from settings
    const groomText = data.groom_name ? ` and ${data.groom_name}` : '';
    const dateText = data.wedding_date ? ` on ${data.wedding_date}` : '';
    const venueText = data.venue ? ` at ${data.venue}` : '';
    const budgetText = data.budget ? ` within budget ${data.budget}` : '';

    const text = `Hi Beyond Weddings, my name is ${data.bride_name}${groomText}. We are planning our wedding${dateText}${venueText}${budgetText} and would love to check your availability and packages!`;
    return `https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`;
  }
}
