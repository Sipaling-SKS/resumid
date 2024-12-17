<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Http\Models\Users;

class GptController extends Controller
{
    public function PostGptAnalyzeResume(Request $request) {
        $gpt = Gpt::find($request->idempotency_key);

        if(!$gpt) {
            $data = json_decode($gpt, true);
            return response(200)->json($data);
        }

        $client = new Client();

        try {
            $requestBody = $request->getContent();
            $response = $client->post('', [
                "body" => $requestBody,
            ]);

            $responseBody =  json_decode($response->getBody()->getContents(), true);

            // Construct Expired Idempotency Key
            $timePlusTwoMinutes = Carbon::now()->addMinutes(2);

            $savedResponse = Gpt::create([
                "idempotency_keys" => $request->header('Idempotency-Key'),
                "gpt_request" => json_encode($requestBody),
                "gpt_response" => json_encode($responseBody),
                "expired_date" => $timePlusTwoMinutes,
            ]);

            return response(200)->json([$savedResponse]);
        } catch (Exception $ex) {
            return;
        }
    }
}
