<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorAuthService
{
    protected $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    public function generateSecret(): string
    {
        return $this->google2fa->generateSecretKey();
    }

    public function generateQrCode(User $user, string $secret): string
    {
        $companyName = config('app.name');
        return $this->google2fa->getQRCodeUrl(
            $companyName,
            $user->email,
            $secret
        );
    }

    public function verifyCode(string $secret, string $code): bool
    {
        return $this->google2fa->verifyKey($secret, $code);
    }

    public function enable(User $user, string $code): bool
    {
        if (!$this->verifyCode($user->two_factor_secret, $code)) {
            return false;
        }

        $user->two_factor_enabled = true;
        $user->save();

        return true;
    }

    public function disable(User $user, string $password): bool
    {
        if (!Hash::check($password, $user->password)) {
            return false;
        }

        $user->two_factor_enabled = false;
        $user->two_factor_secret = null;
        $user->save();

        return true;
    }

    public function generateBackupCodes(): array
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
        }
        return $codes;
    }
}
