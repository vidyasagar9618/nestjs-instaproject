// firebase.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly firebaseAdmin: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      this.firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: "insta-post-8caab",
          clientEmail: "firebase-adminsdk-ujv5a@insta-post-8caab.iam.gserviceaccount.com",
          privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDXpNkHXgSVZx7s\n+srcEvDc5AOAc8AV05fj/QrJReMzwV0hOS+vA9IRIgw8aQ9gayYRxzLYNGXm+G//\nHvPXDgYN3e8za0upSTOYF6OoG1oUXmIJLzTsI+EWk4ciy0SCXqD4cgZgTQSzzJna\nn0AcwZVb3WdotlgIP85QV+1tsUHcLlsVvdsNaUhJAhtEjemDU8dDjYbk8ShkCwzo\nx9EUjZWQY9+KmA0RCdIggcjUmbVJtdSMnEbvKRSmpYVH0DsVFOhGUvzfYa8kbDoa\n+uwL5Fr9Aoyu2HoRlBrWLC0KQ9G+tMqgQMfSYxjj2GQkZBw/Cm97WC9Hd9aovlcN\nnC2vAM7lAgMBAAECggEAIUUag35NaGbZs3KOtBKAsnZuqzWbN/gxHH3bWVSc1PeA\ncKeb2ZLWKPTe/L5cHszujtqerRMJz8SaXuWTIFBWaHL1Ed1RdeOd1Vl8U0DZDoBw\npqhvr/5pyVZnMzE3jNegWoRubb15kWs/0iY0uYW3ufh4Q68Ho5+DK2EizVmGPDu/\n+r38zYMlOlcb33OTNEwZi85Es0DUbE6Vuz/R313QMNgZwtEtJj/OIIOAaApRycmq\nTFVUgDd3NC97k+fKjo0YsA9x2bumxCyfwiSs6vtgTFhVnMAg9V25Vi8uSsGxgGVc\nucf3Qclb5gg8OHH0G2oDhHE2GqXAz2l52nFvN2uytwKBgQD8mJwnb9Heac/yK6es\n8OWR8rFmG0V3YXhL+AmhQPlyUDzRbGmKO/FkEjVA9Z6PsGN0gSej+8Ovkvvt571P\nxnybdQZNrU994+N0B6COJbSHfB5It3atMPEczeTX1vn2UBZYgwjp4+mBQdA6+0WE\nEQAHzq2yABjr3Vd8jFrpN3DtKwKBgQDajMMwylw0TFXtD642D1cb62aIH/bE5PEh\nvMVmRxkmxBFEELsOHaWYuOEebTpA4qdlmiofwMw9opf0Wh5xvE8W9PQBE1JXVej9\neFM0TiVP2H6jUFY7neAhp1RL5+LTQ72/whzwj0HnWeM0ySQVQb1Yc2GWcdz1SgM2\n0X++z1XMLwKBgCXDkyT6PMApxaMJD8p1QX0ucYM4dIxCkD+bV6U6F5EVmeIdeTHn\ngFFbv4Z0sj39OwFCBfEoRLtNGEkbKlxw6lQ7jLO0Q3wow+qm8UQPMwxGbCim9SEz\nffi2d44lX72Jf62/+WcuYcynUEBhLKVv/TctmR5RkWhB8UB3o2fWmBV9AoGAbJOI\nGYI/YqAWBEtJAoSGg1Fkw/YVU+ZlwZwV+eUSosa/yTACrlWeQox/Eu2zBi9UeM6p\nZNMU5P4VPglTnK+wHziczLf7rXX55YtU0uSL9uoYqCwuWzno8u89muReNRUvfMgE\nNqMFW9m1XjEbow/g8MOJ1QNGgfo+NIrKS1KYTnMCgYAxOKVnSVMel2bMbQr1VXjO\n/dESIAh3AaUi9kRPWxqerpRQbjCsoRR6xpLSPg3a9HNosF55ZvV5ltF1Eb4A98tn\noEym6PceaQcYPU46suF2zLXpxcb7LlNQrn9DKKEWPbRk0JkgUkhBRYuOa/AingI8\nVOtrtOSXVl4ZNNQnGkBxzQ==\n-----END PRIVATE KEY-----\n",
        }),
      });
    } else {
      this.firebaseAdmin = admin.app(); // Reuse existing app
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid ID token');
    }
  }
}
