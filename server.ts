import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Google GenAI initialization with User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// POST /api/gemini/generate-questions (Wizard Step 3)
app.post('/api/gemini/generate-questions', async (req, res) => {
  try {
    const {
      subject = 'Toán học',
      grade = 'Khối 9',
      topic = '',
      questionCount = 3,
      selectedTypes = ['single_choice'],
      sourceText = '',
      strictCurriculum = true,
    } = req.body;

    const systemInstruction = `Bạn là chuyên gia khảo thí và đo lường giáo dục Bộ GD&ĐT Việt Nam, am hiểu sâu sắc chương trình GDPT 2018.
Nhiệm vụ: Biên soạn các câu hỏi kiểm tra đánh giá theo đúng chuẩn cấu trúc và ngữ cảnh được cung cấp.
Nguyên tắc:
1. Tuyệt đối không bịa đặt kiến thức không có cơ sở khoa học. Bám sát nội dung và mục tiêu cần đạt.
2. Với môn Toán/Khoa học: Dùng ký hiệu toán học chuẩn xác, công thức rõ ràng.
3. Luôn cung cấp lời giải chi tiết và barem chấm điểm từng bước.
4. Trả về đúng định dạng JSON Array chứa danh sách các câu hỏi.`;

    const promptText = `Hãy tạo ${questionCount} câu hỏi môn ${subject} cho ${grade}, chủ đề "${topic}".
Các dạng câu hỏi cần tạo thuộc danh sách: ${selectedTypes.join(', ')}.
${sourceText ? `Nội dung tài liệu nguồn tham khảo bắt buộc bám sát:\n"""\n${sourceText}\n"""` : ''}

Yêu cầu xuất ra JSON Array các object câu hỏi với schema:
[
  {
    "type": "single_choice" | "multiple_choice" | "true_false" | "matching" | "ordering" | "fill_blank" | "short_answer" | "essay" | "passage_based",
    "typeLabel": "Một đáp án" | "Nhiều đáp án" | "Đúng / Sai từng ý" | "Ghép đôi" | "Sắp xếp" | "Điền khuyết" | "Trả lời ngắn" | "Tự luận" | "Tình huống",
    "level": "nhan_biet" | "thong_hieu" | "van_dung" | "van_dung_cao",
    "content": "Nội dung câu hỏi...",
    "points": 1.0,
    "options": [{"id": "A", "content": "Đáp án A", "isCorrect": true}, {"id": "B", "content": "Đáp án B", "isCorrect": false}, ...],
    "explanation": "Lời giải chi tiết từng bước...",
    "trueFalseItems": [{"id": "tf1", "statement": "Mệnh đề 1", "isTrue": true, "explanation": "Giải thích"}],
    "matchingPairs": [{"id": "m1", "leftPrompt": "Vế trái 1", "rightTarget": "Vế phải A", "correctMatchId": "A"}],
    "orderingItems": [{"id": "o1", "text": "Bước 1", "correctOrder": 1}],
    "fillBlanks": [{"blankIndex": 1, "acceptableAnswers": ["từ đúng"]}],
    "shortAnswerConfig": {"correctAnswers": ["đáp số"], "tolerance": 0, "unit": ""},
    "rubric": [{"id": "r1", "name": "Tiêu chí 1", "maxPoints": 1.0, "description": "Mô tả đạt tiêu chí"}]
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const textOutput = response.text || '[]';
    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(textOutput);
    } catch (parseErr) {
      console.warn('Could not parse Gemini JSON, attempting substring recovery', parseErr);
      const jsonMatch = textOutput.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedQuestions = JSON.parse(jsonMatch[0]);
      }
    }

    return res.json({ success: true, questions: parsedQuestions });
  } catch (error: any) {
    console.error('Error generating questions with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Lỗi khi gọi AI Gemini sinh câu hỏi',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Classroom Management Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
