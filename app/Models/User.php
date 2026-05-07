<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'avatar', 'last_study_case_id', 'active_analysis_cases', 'completed_audits', 'current_layer'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token' , 'open_ai_api_key'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
    public function avatar(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? asset('storage/' . ltrim($value, '/')) : null,
            set: fn (?string $value) => $value ? ltrim($value, '/') : null,
        );
    }

    public function StudyCases() {
        return $this->belongsToMany(StudyCase::class);
    }

    /*public function LastStudyCase() {
        return $this->belongsTo(StudyCase::class, 'last_study_case_id')
            ->withPivot('current_layer');
    }*/
}
