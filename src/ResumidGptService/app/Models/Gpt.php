<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gpt extends Model
{
    use HasFactory;

    protected $primaryKey = "id";
    protected $table = "tr_gpt_request_log";
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'idempotency_keys',
        'gpt_request',
        'gpt_response',
        'expired_date'
    ];
}
