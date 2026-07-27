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

export const query = `
{
  ${userQuery}

  ${xpQuery}

  ${resultQuery}
}
`;
