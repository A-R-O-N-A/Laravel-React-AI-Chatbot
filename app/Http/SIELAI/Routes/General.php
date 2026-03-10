<?php

namespace App\Http\SIELAI\Routes;

class General {

    public readonly string $baseUrl;
    public readonly string $ping;
    public readonly string $ragChatBm25;
    public readonly string $ragFileVectorize;
    public readonly string $ragFileChatV2;
    public readonly string $ocrProcessImage;
    public readonly string $dataAnalyticsAnalyze;

    public function __construct() {
       $this->baseUrl = 'http://72.62.69.183:8002';

        $this->ping = $this->baseUrl . '/api/lab/test/ping';
        $this->ragChatBm25 = $this->baseUrl . '/api/lab/test/rag/chat/ollama/bm25';
        $this->ragFileVectorize = $this->baseUrl . '/api/lab/test/rag/file/vectorize/';
        $this->ragFileChatV2 = $this->baseUrl . '/api/lab/test/rag/file/chat/v2/';
        $this->ocrProcessImage = $this->baseUrl . '/api/ocr/process-image/';
        $this->dataAnalyticsAnalyze = $this->baseUrl . '/api/data-analytics/data-analytics/analyze';
    }
}