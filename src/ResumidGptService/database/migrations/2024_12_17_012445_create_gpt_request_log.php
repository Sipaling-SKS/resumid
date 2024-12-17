<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGptRequestLog extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tr_gpt_request_log', function (Blueprint $table) {
            $table->id();
            $table->string("idempotency_keys", 255);
            $table->text("gpt_request");
            $table->text("gpt_response")->nullable(true);
            $table->timestamp("expired_date");
            $table->timestamps() ;
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gpt_request_log');
    }
}
