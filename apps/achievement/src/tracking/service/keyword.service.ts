import { Injectable } from '@nestjs/common';

@Injectable()
export class KeywordService {
    public containsKeyword(text: string, keyword: string): boolean {
        return text.toLowerCase().includes(keyword.toLowerCase());
    }
}
