const userQuery = `
user {
  avatarUrl
  id
  login
  auditRatio

  events(
    where: {
      eventId: { _eq: 41 }
    }
  ) {
    level
  }

  audits(
    where: {
      closureType: {
        _in: [succeeded, failed, expired]
      }
    }
  ) {
    closureType
  }
}
`;

const xpQuery = `
totalXP: transaction_aggregate(
  where: {
    type: { _eq: "xp" }
    event: {
      object: {
        name: { _eq: "Module" }
      }
    }
  }
) {
  aggregate {
    sum {
      amount
    }
  }
}
`;

const resultQuery = `
results: result(
  where: {
    eventId: { _eq: 41 }
  }
) {
  grade
}
`;

/* Additive only: powers the new XP trend chart. Does not touch any
   existing field, so nothing above changes shape or behavior. */
const xpHistoryQuery = `
xpHistory: transaction(
  where: {
    type: { _eq: "xp" }
    event: {
      object: {
        name: { _eq: "Module" }
      }
    }
  }
  order_by: { createdAt: asc }
) {
  amount
  createdAt
}
`;

export const query = `
{
  ${userQuery}

  ${xpQuery}

  ${resultQuery}

  ${xpHistoryQuery}
}
`;
